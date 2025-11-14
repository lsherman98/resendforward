package secrets

import (
	"os"

	"github.com/lsherman98/resendforward/pocketbase/collections"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/security"
)

func Init(app *pocketbase.PocketBase) error {
	app.OnRecordCreateRequest(collections.ResendAPIKeys).BindFunc(func(e *core.RecordRequestEvent) error {
		key := e.Record.GetString("key")
		if key == "" {
			return e.BadRequestError("no resend api key found in request", nil)
		}

		encryptedKey, err := security.Encrypt([]byte(key), os.Getenv("AES_KEY"))
		if err != nil {
			e.App.Logger().Error("Failed to encrypt resend api key: ", "err", err)
			return e.InternalServerError("failed to encrypt resend api key", nil)
		}

		e.Record.Set("key", encryptedKey)
		return e.Next()
	})

	app.OnRecordCreateRequest(collections.ResendWebhookSecrets).BindFunc(func(e *core.RecordRequestEvent) error {
		key := e.Record.GetString("secret")
		if key == "" {
			return e.BadRequestError("no resend webhook secret found in request", nil)
		}

		encryptedKey, err := security.Encrypt([]byte(key), os.Getenv("AES_KEY"))
		if err != nil {
			e.App.Logger().Error("Failed to encrypt resend webhook secret: ", "err", err)
			return e.InternalServerError("failed to encrypt resend webhook secret", nil)
		}

		e.Record.Set("secret", encryptedKey)
		return e.Next()
	})

	return nil
}
