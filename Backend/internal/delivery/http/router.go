package httpapi

import (
	"database/sql"
	"time"

	apiresponse "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/delivery/http/handler"
	"desa-borong-api/internal/delivery/http/middleware"
	iauth "desa-borong-api/internal/infrastructure/auth"
	"net/http"
)

func NewRouter(h *handler.Handler, tokens *iauth.Service, db *sql.DB) http.Handler {
	m := http.NewServeMux()
	auth := middleware.Auth(tokens)
	admin := middleware.Role("admin", "super_admin")
	super := middleware.Role("super_admin")
	limit := middleware.NewRateLimiter(10, time.Minute).Middleware
	_ = limit

	public := func(pattern string, fn http.HandlerFunc) { m.Handle(pattern, fn) }
	secure := func(pattern string, fn http.HandlerFunc) { m.Handle(pattern, auth(fn)) }
	administrate := func(pattern string, fn http.HandlerFunc) { m.Handle(pattern, auth(admin(fn))) }
	rateLimited := func(pattern string, fn http.HandlerFunc) { m.Handle(pattern, limit(fn)) }

	public("/healthz", func(w http.ResponseWriter, r *http.Request) {
		apiresponse.JSON(w, 200, map[string]string{"status": "ok"})
	})
	public("/readyz", func(w http.ResponseWriter, r *http.Request) {
		if db.PingContext(r.Context()) != nil {
			apiresponse.JSON(w, 503, map[string]string{"status": "not ready"})
			return
		}
		apiresponse.JSON(w, 200, map[string]string{"status": "ready"})
	})

	// Auth & account
	rateLimited("POST /api/auth/register", h.Register)
	rateLimited("POST /api/auth/verify-otp", h.VerifyOTP)
	rateLimited("POST /api/auth/resend-otp", h.ResendOTP)
	rateLimited("POST /api/auth/forgot-password", h.ForgotPassword)
	rateLimited("POST /api/auth/reset-password", h.ResetPassword)
	rateLimited("POST /api/auth/login", h.Login)
	rateLimited("POST /api/auth/refresh", h.Refresh)
	secure("POST /api/auth/logout", h.Logout)
	secure("GET /api/auth/me", h.Me)
	secure("POST /api/auth/change-password", h.ChangePassword)
	secure("PUT /api/users/profile", h.UpdateProfile)
	m.Handle("GET /api/users", auth(super(http.HandlerFunc(h.UsersList))))
	m.Handle("PUT /api/users/{id}", auth(super(http.HandlerFunc(h.UserUpdate))))

	// Berita
	public("GET /api/berita", h.BeritaList)
	public("GET /api/berita/{slug}", h.BeritaGet)
	administrate("GET /api/admin/berita", h.BeritaAdminList)
	administrate("POST /api/berita", h.BeritaCreate)
	administrate("PUT /api/berita/{id}", h.BeritaUpdate)
	administrate("DELETE /api/berita/{id}", h.BeritaDelete)

	// Layanan & pengajuan
	public("GET /api/layanan", h.JenisList)
	public("GET /api/layanan/{kode}", h.JenisGet)
	administrate("GET /api/admin/layanan", h.JenisAdminList)
	administrate("POST /api/layanan", h.JenisCreate)
	administrate("PUT /api/layanan/{kode}", h.JenisUpdate)
	administrate("DELETE /api/layanan/{kode}", h.JenisDelete)
	secure("POST /api/pengajuan", h.PengajuanCreate)
	secure("GET /api/pengajuan/{id}/lampiran/{lampiranID}", h.PengajuanLampiran)
	public("GET /api/pengajuan/{nomorResi}", h.PengajuanGet)
	public("GET /api/surat/{nomorResi}", h.PengajuanGetSurat)
	public("GET /api/verifikasi/surat/{code}", h.VerifikasiSurat)
	secure("GET /api/penduduk/nik/{nik}", h.GetPendudukByNIK)
	secure("GET /api/pengajuan/saya", h.PengajuanSaya)
	administrate("GET /api/pengajuan", h.PengajuanList)
	administrate("GET /api/admin/pengajuan/buku-agenda", h.PengajuanBukuAgenda)
	administrate("PATCH /api/pengajuan/{id}/status", h.PengajuanStatus)

	administrate("POST /api/pengajuan/{id}/publish", h.PengajuanPublish)
	administrate("DELETE /api/admin/pengajuan/{id}", h.PengajuanDelete)


	// Pengaduan
	secure("POST /api/pengaduan", h.PengaduanCreate)
	public("GET /api/pengaduan/{nomorTiket}", h.PengaduanGet)
	secure("GET /api/pengaduan/saya", h.PengaduanSaya)
	administrate("GET /api/pengaduan", h.PengaduanList)
	administrate("PATCH /api/pengaduan/{id}/status", h.PengaduanStatus)

	// Profil & data desa
	public("GET /api/profil-desa", h.ProfilGet)
	administrate("PUT /api/profil-desa", h.ProfilUpdate)
	public("GET /api/perangkat-desa", h.PerangkatList)
	administrate("POST /api/perangkat-desa", h.PerangkatCreate)
	administrate("PUT /api/perangkat-desa/{id}", h.PerangkatUpdate)
	administrate("DELETE /api/perangkat-desa/{id}", h.PerangkatDelete)
	public("GET /api/dusun", h.DusunList)
	public("GET /api/potensi-desa", h.PotensiList)
	public("GET /api/fasilitas", h.FasilitasList)
	administrate("POST /api/fasilitas", h.FasilitasCreate)
	administrate("PUT /api/fasilitas/{id}", h.FasilitasUpdate)
	administrate("DELETE /api/fasilitas/{id}", h.FasilitasDelete)

	// Statistik, APBDes, agenda
	public("GET /api/statistik/penduduk", h.StatistikGet)
	administrate("PUT /api/statistik/penduduk", h.StatistikUpdate)
	public("GET /api/apbdes", h.ApbdesGet)
	administrate("PUT /api/apbdes", h.ApbdesUpdate)
	public("GET /api/agenda", h.AgendaList)
	administrate("POST /api/agenda", h.AgendaCreate)
	administrate("PUT /api/agenda/{id}", h.AgendaUpdate)
	administrate("DELETE /api/agenda/{id}", h.AgendaDelete)

	// Galeri & UMKM
	public("GET /api/galeri", h.GaleriList)
	public("GET /api/galeri/{id}", h.GaleriGet)
	administrate("POST /api/galeri", h.GaleriCreate)
	administrate("PUT /api/galeri/{id}", h.GaleriUpdate)
	administrate("DELETE /api/galeri/{id}", h.GaleriDelete)
	public("GET /api/umkm", h.UmkmList)
	public("GET /api/umkm/{slug}", h.UmkmGet)
	administrate("POST /api/umkm", h.UmkmCreate)
	administrate("PUT /api/umkm/{id}", h.UmkmUpdate)
	administrate("DELETE /api/umkm/{id}", h.UmkmDelete)

	// Transparansi Pajak Desa
	public("GET /api/pajak/ringkasan", h.PajakRingkasan)
	public("GET /api/pajak/jenis", h.PajakJenisList)
	public("GET /api/pajak/transaksi", h.PajakTransaksiPublicList)
	public("GET /api/pajak/transaksi/{nomorBukti}", h.PajakTransaksiGetNomor)
	public("GET /api/pajak/setoran", h.PajakSetoranList)
	public("GET /api/pajak/setoran/{id}", h.PajakSetoranGet)
	secure("GET /api/pajak/saya", h.PajakTransaksiSaya)

	administrate("GET /api/admin/pajak/jenis", h.PajakJenisAdminList)
	administrate("POST /api/admin/pajak/jenis", h.PajakJenisSave)
	administrate("PUT /api/admin/pajak/jenis/{id}", h.PajakJenisSave)
	administrate("DELETE /api/admin/pajak/jenis/{id}", h.PajakJenisDelete)

	administrate("GET /api/admin/pajak/wajib-pajak", h.PajakWajibList)
	administrate("GET /api/admin/pajak/wajib-pajak/{id}", h.PajakWajibGet)
	administrate("POST /api/admin/pajak/wajib-pajak", h.PajakWajibSave)
	administrate("PUT /api/admin/pajak/wajib-pajak/{id}", h.PajakWajibSave)
	administrate("DELETE /api/admin/pajak/wajib-pajak/{id}", h.PajakWajibDelete)

	administrate("GET /api/admin/pajak/transaksi", h.PajakTransaksiAdminList)
	administrate("POST /api/admin/pajak/transaksi", h.PajakTransaksiCreate)
	administrate("PATCH /api/admin/pajak/transaksi/{id}/status", h.PajakTransaksiStatus)

	administrate("GET /api/admin/pajak/setoran", h.PajakSetoranList)
	administrate("POST /api/admin/pajak/setoran", h.PajakSetoranCreate)
	administrate("POST /api/admin/pajak/setoran/{id}/konfirmasi", h.PajakSetoranKonfirmasi)
	administrate("GET /api/admin/pajak/audit", h.PajakAuditList)

	return m
}
