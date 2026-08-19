package persuratan

import "testing"

func TestNormalizeWhatsAppNumber(t *testing.T) {
	cases := []struct {
		in   string
		want string
	}{
		{"08123456789", "628123456789"},
		{"+628123456789", "628123456789"},
		{"8123456789", "628123456789"},
		{"628123456789", "628123456789"},
		{"(021) 555-0100", "62215550100"},
		{"", ""},
	}
	for _, c := range cases {
		if got := normalizeWhatsAppNumber(c.in); got != c.want {
			t.Errorf("normalizeWhatsAppNumber(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}
