import React from 'react'

export type ALERT_CONTENT_TYPE = {
  header: string
  content?: React.ReactNode
}

export type ALERTS_TYPE = {
  [key: string]: ALERTS_TYPE | ((...args: any[]) => ALERT_CONTENT_TYPE)
}

export const ALERTS = {
  generic: {
    confirmDeleteEntity: (entityLabel: string) => ({
      header: `${entityLabel} löschen?`,
      // content:
      //   '',
    }),
  },
  templates: {
    confirmDelete: () => ({
      header: 'Vorlage löschen?',
      content:
        'Alle zu dieser Vorlage hochgeladenen Dokumente werden dabei gelöscht.',
    }),
  },
}
