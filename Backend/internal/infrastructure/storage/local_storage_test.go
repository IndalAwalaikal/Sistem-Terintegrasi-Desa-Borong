package storage

import (
	"context"
	"strings"
	"testing"
)

func TestSaveRejectsTraversalByGeneratingServerFilename(t *testing.T) {
	dir := t.TempDir()
	s, err := NewLocal(dir, "/uploads")
	if err != nil {
		t.Fatal(err)
	}
	url, err := s.Save(context.Background(), "../pengajuan", strings.NewReader("dokumen"), "../../ktp.pdf")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.HasPrefix(url, "/uploads/pengajuan/") || !strings.HasSuffix(url, ".pdf") {
		t.Fatalf("unsafe URL: %q", url)
	}
	if err := s.Delete(context.Background(), "/uploads/../../etc/passwd"); err == nil {
		t.Fatal("expected traversal URL rejection")
	}
}
