import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nickname: "",
  name: "",
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.nickname = action.payload.nickname
      state.nombre = action.payload.nombre
      state.apellido = action.payload.apellido
      state.rut = action.payload.rut
      state.servicio = action.payload.servicio
      state.rol = action.payload.rol
    },
    unsetUserInfo: (state, action) => {
      state.nickname = action.payload.nickname
      state.nombre = action.payload.nombre
      state.apellido = action.payload.apellido
      state.rut = action.payload.rut
      state.servicio = action.payload.servicio
      state.rol = action.payload.rol
    },
  }
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer