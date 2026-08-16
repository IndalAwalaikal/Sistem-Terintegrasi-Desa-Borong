package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	httpapi "desa-borong-api/internal/delivery/http"
	"desa-borong-api/internal/delivery/http/handler"
	"desa-borong-api/internal/delivery/http/middleware"
	iauth "desa-borong-api/internal/infrastructure/auth"
	"desa-borong-api/internal/infrastructure/config"
	email "desa-borong-api/internal/infrastructure/email"
	mysqlstore "desa-borong-api/internal/infrastructure/mysql"
	"desa-borong-api/internal/infrastructure/storage"
	"desa-borong-api/internal/usecase"
	asecase "desa-borong-api/internal/usecase/auth"
	"desa-borong-api/internal/usecase/berita"
	"desa-borong-api/internal/usecase/desa"
	"desa-borong-api/internal/usecase/finance"
	"desa-borong-api/internal/usecase/galeri"
	"desa-borong-api/internal/usecase/pajak"
	"desa-borong-api/internal/usecase/pengaduan"
	"desa-borong-api/internal/usecase/persuratan"
	"desa-borong-api/internal/usecase/umkm"
	ucuser "desa-borong-api/internal/usecase/user"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := config.Load()
	if err != nil {
		log.Error("configuration is invalid", "error", err)
		os.Exit(1)
	}

	db, err := mysqlstore.Open(cfg)
	if err != nil {
		log.Error("database connection failed", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	tokens := iauth.New(cfg.JWTSecret, cfg.AccessTTL)
	hasher := iauth.NewBcryptHasher()
	tx := mysqlstore.NewTx(db)
	fileStorage, err := storage.NewLocal(cfg.StoragePath, "/uploads")
	if err != nil {
		log.Error("storage init failed", "error", err)
		os.Exit(1)
	}

	// Email delivery (Brevo when configured, otherwise a logging noop).
	mailer := email.New(cfg.BrevoAPIKey, cfg.BrevoFromEmail)

	// Repositories (infrastructure adapters).
	userRepo := mysqlstore.NewUserRepo(db)
	refreshRepo := mysqlstore.NewRefreshTokenRepo(db)
	otpRepo := mysqlstore.NewOTPRepo(db)
	pendingRepo := mysqlstore.NewPendingRegistrationRepo(db)
	beritaRepo := mysqlstore.NewBeritaRepo(db)
	jenisRepo := mysqlstore.NewJenisSuratRepo(db)
	pengajuanRepo := mysqlstore.NewPengajuanRepo(db)
	pendudukRepo := mysqlstore.NewPendudukRepo(db)
	pengaduanRepo := mysqlstore.NewPengaduanRepo(db)
	profilRepo := mysqlstore.NewProfilRepo(db)
	perangkatRepo := mysqlstore.NewPerangkatRepo(db)
	dusunRepo := mysqlstore.NewDusunRepo(db)
	potensiRepo := mysqlstore.NewPotensiRepo(db)
	fasilitasRepo := mysqlstore.NewFasilitasRepo(db)
	statistikRepo := mysqlstore.NewStatistikRepo(db)
	apbdesRepo := mysqlstore.NewApbdesRepo(db)
	agendaRepo := mysqlstore.NewAgendaRepo(db)
	galeriRepo := mysqlstore.NewGaleriRepo(db)
	umkmRepo := mysqlstore.NewUmkmRepo(db)
	adminUserRepo := mysqlstore.NewAdminUserRepo(db)
	pajakRepo := mysqlstore.NewPajakRepo(db)

	// Use case services (business logic).
	authSvc := asecase.NewService(userRepo, refreshRepo, otpRepo, pendingRepo, mailer, hasher, tokens, tx, cfg.RefreshTTL, cfg.OTPTTL)
	if cfg.BootstrapSuperAdminEmail != "" {
		if err := authSvc.BootstrapSuperAdmin(context.Background(), cfg.BootstrapSuperAdminName, cfg.BootstrapSuperAdminEmail, cfg.BootstrapSuperAdminPassword); err != nil {
			log.Error("super admin bootstrap failed", "error", err)
			os.Exit(1)
		}
	}
	beritaSvc := berita.NewService(beritaRepo)
	persSvc := persuratan.NewService(jenisRepo, pengajuanRepo, pendudukRepo, fileStorage, tx, userRepo, mailer, cfg.AppURL, cfg.HMACSecret)

	aduanSvc := pengaduan.NewService(pengaduanRepo)
	desaSvc := desa.NewService(profilRepo, perangkatRepo, dusunRepo, potensiRepo, fasilitasRepo)
	finSvc := finance.NewService(statistikRepo, apbdesRepo, agendaRepo)
	galSvc := galeri.NewService(galeriRepo)
	umkmSvc := umkm.NewService(umkmRepo)
	userSvc := ucuser.NewService(adminUserRepo)
	pajakSvc := pajak.NewService(pajakRepo)

	app := usecase.New(authSvc, beritaSvc, persSvc, aduanSvc, desaSvc, finSvc, galSvc, umkmSvc, userSvc, pajakSvc)
	h := handler.New(app)
	r := httpapi.NewRouter(h, tokens, db)

	// Serve locally-uploaded files (lampiran, galeri, UMKM) from the configured path.
	mux := http.NewServeMux()
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.StoragePath))))
	mux.Handle("/", r)

	s := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           middleware.Common(cfg.CORSOrigins, cfg.Env, log)(mux),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	go func() {
		log.Info("server started", "addr", s.Addr)
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error("server failed", "error", err)
		}
	}()

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = s.Shutdown(ctx)
}
