import { useState } from 'react'

const isExists = (value: string) => (!value ? 'Field is required' : null);

const isMinValue = (value: number, minDefaultValue: number) => (value < minDefaultValue ? `Minimal value ${minDefaultValue}` : null)

const useForm = () => {
  const [form, setForm] = useState('');
  const routes = [
    'create',
    'lobby admin',
    'detail',
    'detail admin',
    'join',
    'Join game',
    'game',
    'move',
    'reveal',
  ]

  const openCreateForm = () => setForm('create');
  const openLobbyForm = () => setForm('lobby');
  const openDetailsForm = () => setForm('detail')

  const closeForm = () => setForm('');
  const onClickRouteChange = (param: string): void => {
    const result = routes.filter(route => route === param)
    setForm(result[0])
  }

  return { form, openCreateForm, closeForm, openLobbyForm, openDetailsForm, onClickRouteChange };
}

export { isExists, isMinValue, useForm };
