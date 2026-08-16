package domain

import "time"

// ProfilDesa is a singleton configuration object stored as JSON in the
// profil_desa table. It mirrors the frontend ProfilDesa type exactly so the
// usecase layer can operate on strongly-typed values instead of raw maps.
type ProfilDesa struct {
	Nama         string    `json:"nama"`
	Kecamatan    string    `json:"kecamatan"`
	Kabupaten    string    `json:"kabupaten"`
	Provinsi     string    `json:"provinsi"`
	KodePos      string    `json:"kodePos"`
	Sejarah      string    `json:"sejarah"`
	Visi         string    `json:"visi"`
	Misi         []string  `json:"misi"`
	LuasWilayah  string    `json:"luasWilayah"`
	JumlahDusun  int       `json:"jumlahDusun"`
	JumlahRW     int       `json:"jumlahRW"`
	JumlahRT     int       `json:"jumlahRT"`
	AlamatKantor string    `json:"alamatKantor"`
	Telepon      string    `json:"telepon"`
	Email        string    `json:"email"`
	Website      string    `json:"website"`
	JamLayanan   string    `json:"jamLayanan"`
	Koordinat    Koordinat `json:"koordinat"`
	FotoKantor   string    `json:"fotoKantor"`
	FotoBanner   []string  `json:"fotoBanner"`
}

type Koordinat struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type PerangkatDesa struct {
	ID      string  `json:"id"`
	Nama    string  `json:"nama"`
	Jabatan string  `json:"jabatan"`
	NIP     *string `json:"nip,omitempty"`
	Foto    string  `json:"foto"`
	Periode string  `json:"periode"`
}

type Dusun struct {
	ID             string `json:"id"`
	Nama           string `json:"nama"`
	Ketua          string `json:"ketua"`
	JumlahRT       int    `json:"jumlahRT"`
	JumlahRW       int    `json:"jumlahRW"`
	JumlahPenduduk int    `json:"jumlahPenduduk"`
	LuasWilayah    string `json:"luasWilayah"`
}

type PotensiDesa struct {
	ID        string `json:"id"`
	Nama      string `json:"nama"`
	Kategori  string `json:"kategori"`
	Deskripsi string `json:"deskripsi"`
	Foto      string `json:"foto"`
}

type FasilitasDesa struct {
	ID         string  `json:"id"`
	Nama       string  `json:"nama"`
	Kategori   string  `json:"kategori"`
	Alamat     string  `json:"alamat"`
	Dusun      string  `json:"dusun"`
	Deskripsi  string  `json:"deskripsi"`
	Kontak     *string `json:"kontak,omitempty"`
	JamLayanan *string `json:"jamLayanan,omitempty"`
}

type StatistikPenduduk struct {
	ID        string        `json:"id"`
	Tahun     int           `json:"tahun"`
	Data      StatistikData `json:"data"`
	UpdatedAt time.Time     `json:"-"`
}

type StatistikData struct {
	Tahun           int                     `json:"tahun"`
	TotalPenduduk   int                     `json:"totalPenduduk"`
	LakiLaki        int                     `json:"lakiLaki"`
	Perempuan       int                     `json:"perempuan"`
	JumlahKK        int                     `json:"jumlahKK"`
	PerDusun        []StatistikPerDusun     `json:"perDusun"`
	RincianDusun    []StatistikRincianDusun `json:"rincianDusun,omitempty"`
	PerKelompokUsia []StatistikKelompokUsia `json:"perKelompokUsia"`
	PerPendidikan   []StatistikPendidikan   `json:"perPendidikan"`
	PerPekerjaan    []StatistikPekerjaan    `json:"perPekerjaan"`
	PerAgama        []StatistikAgama        `json:"perAgama"`
}

type StatistikPerDusun struct {
	Dusun  string `json:"dusun"`
	Jumlah int    `json:"jumlah"`
}

type StatistikRincianDusun struct {
	Dusun          string `json:"dusun"`
	LakiLaki       int    `json:"lakiLaki"`
	Perempuan      int    `json:"perempuan"`
	KepalaKeluarga int    `json:"kepalaKeluarga"`
	Kelahiran      int    `json:"kelahiran"`
	Kematian       int    `json:"kematian"`
	PindahMasuk    int    `json:"pindahMasuk"`
	PindahKeluar   int    `json:"pindahKeluar"`
}

type StatistikKelompokUsia struct {
	Rentang string `json:"rentang"`
	Jumlah  int    `json:"jumlah"`
}

type StatistikPendidikan struct {
	Jenjang string `json:"jenjang"`
	Jumlah  int    `json:"jumlah"`
}

type StatistikPekerjaan struct {
	Pekerjaan string `json:"pekerjaan"`
	Jumlah    int    `json:"jumlah"`
}

type StatistikAgama struct {
	Agama  string `json:"agama"`
	Jumlah int    `json:"jumlah"`
}

type ApbdesRingkasan struct {
	Tahun           int          `json:"tahun"`
	Bulan           int          `json:"bulan,omitempty"`    // 1-12 jika difilter bulanan; 0 = tanpa filter periode
	Triwulan        int          `json:"triwulan,omitempty"` // 1-4 jika difilter triwulanan; 0 = tanpa filter periode
	TotalPendapatan float64      `json:"totalPendapatan"`
	TotalBelanja    float64      `json:"totalBelanja"`
	Items           []ApbdesItem `json:"items"`
}

type ApbdesItem struct {
	ID          string  `json:"id"`
	Tahun       int     `json:"tahun"`
	Bulan       *int    `json:"bulan,omitempty"`    // periode bulanan (1-12); nil = bukan entri bulanan
	Triwulan    *int    `json:"triwulan,omitempty"` // periode triwulanan (1-4); nil = bukan entri triwulanan
	Kategori    string  `json:"kategori"` // 'pendapatan' | 'belanja'
	SubKategori string  `json:"subKategori"`
	Jumlah      float64 `json:"jumlah"`
	Persentase  float64 `json:"persentase"`
}

type AgendaKegiatan struct {
	ID             string     `json:"id"`
	Judul          string     `json:"judul"`
	Deskripsi      string     `json:"deskripsi"`
	TanggalMulai   time.Time  `json:"tanggalMulai"`
	TanggalSelesai *time.Time `json:"tanggalSelesai,omitempty"`
	Lokasi         string     `json:"lokasi"`
	Penyelenggara  string     `json:"penyelenggara"`
	Kategori       string     `json:"kategori"`
}

type GaleriAlbum struct {
	ID        string       `json:"id"`
	Judul     string       `json:"judul"`
	Deskripsi string       `json:"deskripsi"`
	Tanggal   string       `json:"tanggal"`
	Kategori  *string      `json:"kategori,omitempty"`
	CoverFoto string       `json:"coverFoto"`
	Fotos     []GaleriFoto `json:"fotos"`
}

type GaleriFoto struct {
	ID      string `json:"id"`
	AlbumID string `json:"-"`
	URL     string `json:"url"`
	Caption string `json:"caption"`
	Tanggal string `json:"tanggal"`
}

type Umkm struct {
	ID             string   `json:"id"`
	Slug           string   `json:"slug"`
	NamaUsaha      string   `json:"namaUsaha"`
	Pemilik        string   `json:"pemilik"`
	Kategori       string   `json:"kategori"`
	Deskripsi      string   `json:"deskripsi"`
	Foto           []string `json:"foto"`
	Kontak         string   `json:"kontak"`
	Alamat         string   `json:"alamat"`
	ProdukUnggulan []string `json:"produkUnggulan"`
	JamOperasional *string  `json:"jamOperasional,omitempty"`
}
