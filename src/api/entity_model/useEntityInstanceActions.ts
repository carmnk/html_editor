import React from 'react'
import { API } from '../API'
import { useToast } from '../../store/reducers/toast'
import { TOASTS } from '../../content/toasts'

export const useGetEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  currentBaseEntityIdFieldName: string,
  setFormData?: (data: any) => void
) => {
  const getInstance = React.useCallback(async () => {
    if (!baseEntityId || !currentBaseEntityIdFieldName) {
      return
    }
    try {
      const res = await API.getEntityInstance(
        baseEntityId,
        entityInstanceId
      ).query()
      setFormData?.(res?.data?.message)
      return res
    } catch (e) {
      console.error(e)
    }
  }, [
    baseEntityId,
    currentBaseEntityIdFieldName,
    entityInstanceId,
    setFormData,
  ])

  return getInstance
}

export const useDeleteEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  onUpdate?: () => void
) => {
  const showToast = useToast()

  const deleteInstance = React.useCallback(async () => {
    if (!baseEntityId) return
    try {
      const res = await API.deleteEntityInstance(
        baseEntityId,
        entityInstanceId
      ).query()
      await onUpdate?.()
      showToast(TOASTS.entities.successDeleteEntity)
    } catch (e) {
      console.error(e)
      showToast(TOASTS.general.genericError)
    }
  }, [baseEntityId, showToast, onUpdate, entityInstanceId])

  return deleteInstance
}

export const useModifyEntityInstance = (
  entityInstanceId: number,
  baseEntityId: number,
  formData?: any,
  onUpdate?: () => void
) => {
  const showToast = useToast()

  const modifyInstance = React.useCallback(async () => {
    if (!baseEntityId) return
    const formDataAdj = formData
    const instance_id = entityInstanceId
    const isEdit = !!instance_id
    try {
      const query = isEdit
        ? API.editEntityInstance(baseEntityId, instance_id).query
        : API.createEntityInstance(baseEntityId).query
      const res = (await query(formDataAdj))?.data
      await onUpdate?.()
      // if (instance_id) {
      //   updateEntityInstance(instance_id)
      // }
      showToast(TOASTS.entities.successEditEntity)
      // if (!isEdit) {
      //   setFormData?.({})
      //   setOpenEntityInstanceForm(null)
      // }
    } catch (e) {
      showToast(TOASTS.general.genericError)
      console.error(e)
    }
  }, [formData, baseEntityId, showToast, onUpdate, entityInstanceId])

  return modifyInstance
}
