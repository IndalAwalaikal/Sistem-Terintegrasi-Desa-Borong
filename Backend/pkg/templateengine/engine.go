package templateengine

import (
	"fmt"
	"html"
	"regexp"
	"strings"
	"time"
)

// RenderContext holds all dynamic data available for document template rendering
type RenderContext struct {
	Pemohon map[string]string // sys.pemohon.nama, sys.pemohon.nik, etc.
	Subjek  map[string]string // sys.subjek.nama, sys.subjek.nik, etc. (if on behalf of family)
	Desa    map[string]string // sys.desa.nama_desa, sys.desa.kecamatan, etc.
	TTD     map[string]string // sys.ttd.nama, sys.ttd.jabatan, sys.ttd.nip
	Meta    map[string]string // sys.meta.nomor_surat, sys.meta.tanggal_surat, sys.meta.qr_code_img
	Form    map[string]string // form.namaUsaha, form.alamatUsaha, etc.
}

var varRegex = regexp.MustCompile(`\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}`)

// RenderTemplate replaces {{placeholder}} variables in HTML template string with actual values.
// All user-supplied values are HTML-escaped to prevent XSS in generated documents.
func RenderTemplate(templateHTML string, ctx RenderContext) string {
	if templateHTML == "" {
		return ""
	}

	result := varRegex.ReplaceAllStringFunc(templateHTML, func(match string) string {
		submatches := varRegex.FindStringSubmatch(match)
		if len(submatches) < 2 {
			return match
		}
		key := strings.TrimSpace(submatches[1])

		// Handle sys.* and form.* namespaces
		parts := strings.SplitN(key, ".", 3)
		if len(parts) < 2 {
			// Direct form key fallback
			if val, ok := ctx.Form[key]; ok {
				return html.EscapeString(val)
			}
			return ""
		}

		prefix := parts[0]
		category := parts[1]

		if prefix == "form" {
			formKey := strings.Join(parts[1:], ".")
			if val, ok := ctx.Form[formKey]; ok {
				return html.EscapeString(val)
			}
			return ""
		}

		if prefix == "sys" {
			switch category {
			case "pemohon":
				if len(parts) >= 3 {
					if val, ok := ctx.Pemohon[parts[2]]; ok {
						return html.EscapeString(val)
					}
				}
			case "subjek":
				if len(parts) >= 3 {
					if val, ok := ctx.Subjek[parts[2]]; ok {
						return html.EscapeString(val)
					}
				}
			case "desa":
				if len(parts) >= 3 {
					if val, ok := ctx.Desa[parts[2]]; ok {
						return html.EscapeString(val)
					}
				}
			case "ttd":
				if len(parts) >= 3 {
					if val, ok := ctx.TTD[parts[2]]; ok {
						return html.EscapeString(val)
					}
				}
			case "meta":
				if len(parts) >= 3 {
					if val, ok := ctx.Meta[parts[2]]; ok {
						return html.EscapeString(val)
					}
				}
			}
		}

		return ""
	})

	return result
}

// FormatIndonesianDate converts a time.Time into Indonesian format (e.g. 16 Agustus 2026)
func FormatIndonesianDate(t time.Time) string {
	bulan := []string{
		"", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
		"Juli", "Agustus", "September", "Oktober", "November", "Desember",
	}
	return fmt.Sprintf("%d %s %d", t.Day(), bulan[t.Month()], t.Year())
}

// FormatRomanMonth returns Roman numeral for month (e.g. 8 -> VIII)
func FormatRomanMonth(month time.Month) string {
	romans := []string{
		"", "I", "II", "III", "IV", "V", "VI",
		"VII", "VIII", "IX", "X", "XI", "XII",
	}
	m := int(month)
	if m >= 1 && m <= 12 {
		return romans[m]
	}
	return "I"
}
