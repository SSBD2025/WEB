import apiClient from "@/lib/apiClient"
import { axiosErrorHandler } from "@/lib/axiosErrorHandler"
import i18n from "@/i18n"

export const getUserById = async (id?: string) => {
  try {
    const res = await apiClient.get(`/account/${id}`)
    return res.data
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.fetch_user_data"))
    throw error
  }
}

export const blockUser = async (id: string) => {
  try {
    await apiClient.post(`/account/${id}/block`)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.block_user"))
    throw error
  }
}

export const unblockUser = async (id: string) => {
  try {
    await apiClient.post(`/account/${id}/unblock`)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.unblock_user"))
    throw error
  }
}

export async function changeUserEmail(id: string, data: { email: string }) {
  try {
    const res = await apiClient.post(`/account/${id}/change-user-email`, data)
    return res.data
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.change_email"))
    throw error
  }
}

export const updateUserData = async (id: string, data: { firstName: string; lastName: string; lockToken: string }) => {
  try {
    await apiClient.put(`/account/${id}`, data)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.update_user_data"))
    throw error
  }
}

export const changeUserPassword = async (id: string) => {
  try {
    await apiClient.post(`/account/${id}/changePassword`)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.reset_password"))
    throw error
  }
}

export const addRoleToUser = async (id: string, role: string) => {
  try {
    await apiClient.put(`/account/${id}/roles/${role.toLowerCase()}`)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.add_role", { role }))
    throw error
  }
}

export const removeRoleFromUser = async (id: string, role: string) => {
  try {
    await apiClient.delete(`/account/${id}/roles/${role.toLowerCase()}`)
  } catch (error) {
    axiosErrorHandler(error, i18n.t("admin.api.errors.remove_role", { role }))
    throw error
  }
}
