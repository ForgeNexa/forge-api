package executor

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/ForgeNexa/forge-api/engine/pkg/models"
)

func TestEngine_ExecutionAndHeaders(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer secret-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status": "ok", "items": [1, 2, 3]}`))
	}))
	defer server.Close()

	engine := NewEngine(5 * time.Second)
	req := models.Request{
		Method:    "GET",
		URL:       server.URL,
		AuthType:  "bearer",
		AuthToken: "secret-token",
	}

	resp, err := engine.Execute(context.Background(), req)
	if err != nil {
		t.Fatalf("request execution failed: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}
	if resp.ContentType != "application/json" {
		t.Fatalf("expected application/json, got %s", resp.ContentType)
	}
	if resp.SizeBytes == 0 {
		t.Fatalf("expected non-zero size")
	}
}
