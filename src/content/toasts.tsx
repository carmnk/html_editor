export type TOASTS_TYPE = {
  [key: string]:
    | TOASTS_TYPE
    | {
        type: string
        title: React.ReactNode
        text?: React.ReactNode
        timeout?: number | null
      }
}

export const TOASTS = {
  admin: {
    successCreateEntityField: {
      type: 'success',
      title: 'Entry successfully created',
      // text: '',
      timeout: 2000,
    },
    successDeleteEntityField: {
      type: 'success',
      title: 'Entry successfully deleted',
      // text: '',
      timeout: 2000,
    },
    successEditEntityField: {
      type: 'success',
      title: 'Entry successfully edited',
      // text: '',
      timeout: 2000,
    },
  },
  entities: {
    successCreateEntity: {
      type: 'success',
      title: 'Entity successfully created',
      // text: '',
      timeout: 2000,
    },
    successDeleteEntity: {
      type: 'success',
      title: 'Entity successfully deleted',
      // text: '',
      timeout: 2000,
    },
    successEditEntity: {
      type: 'success',
      title: 'Entity successfully edited',
      // text: '',F
      timeout: 2000,
    },
  },

  template: {
    makeToast: ((
      type: string,
      title: string,
      text: string,
      timeout: number
    ) => ({
      type,
      title,
      text,
      timeout,
    })) as any,
  },

  general: {
    genericError: {
      type: 'error',
      title: 'Fehler',
      text: 'Die Aktion konnte nicht durchgeführt werden',
      timeout: null,
    },
    errorMissingData: {
      type: 'error',
      title: 'Fehler - Fehlende Eingabewerte',
      text: 'Bitte befüllen Sie die erforderlichen Felder',
      timeout: 2000,
    },
    errorMissingDataHinted: ((fields: string[]) => ({
      type: 'error',
      title: 'Fehlende Eingabewerte für folgende Felder:',
      text: fields.join(', '),
      timeout: 2000,
    })) as any,
  },
  documents: {
    errorFileFormat: {
      type: 'error',
      title: 'Fehler - Falsches Dateiformat',
      text: 'Bitte laden Sie eine Datei mit dem richtigen Format hoch',
      timeout: 2000,
    },
  },
}
