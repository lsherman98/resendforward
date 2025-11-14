package crons

import (
	"time"

	"github.com/lsherman98/resendforward/pocketbase/collections"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
)

func Init(app *pocketbase.PocketBase) error {
	app.Cron().MustAdd("CleanUpEvents", "0 0 * * *", func() {
		forwardingEventsCollection, err := app.FindCollectionByNameOrId(collections.ForwardingEvents)
		if err != nil {
			return
		}

		cutoffDate := time.Now().AddDate(0, 0, -30).UTC()
		records, err := app.FindRecordsByFilter(forwardingEventsCollection, "created < {:cutoff}", "", 0, 0, dbx.Params{
			"cutoff": cutoffDate.Format(time.RFC3339),
		})
		if err != nil {
			return
		}

		for _, record := range records {
			err := app.Delete(record)
			if err != nil {
				continue
			}
		}
	})

	return nil
}
