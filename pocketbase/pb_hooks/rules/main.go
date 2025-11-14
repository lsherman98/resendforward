package rules

import (
	"github.com/lsherman98/resendforward/pocketbase/collections"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Init(app *pocketbase.PocketBase) error {
	app.OnRecordCreateRequest(collections.ForwardingRules).BindFunc(func(e *core.RecordRequestEvent) error {
		user, err := app.FindRecordById(collections.Users, e.Auth.Id)
		if err != nil {
			return e.BadRequestError("something went wrong", nil)
		}

		if user.GetString("tier") == "free" {
			ruleCount, err := app.CountRecords(collections.ForwardingRules, dbx.HashExp{
				"user": e.Auth.Id,
			})
			if err != nil {
				return e.BadRequestError("something went wrong", nil)
			}

			if ruleCount >= 1 {
				return e.ForbiddenError("you have reached the maximum number of rules", nil)
			}
		}

		return e.Next()
	})

	return nil
}
