import {useState} from 'react'

const isExists = (value: string) => (!value ? 'Field is required' : null);

const useForm = () => {
    const [form, setForm] = useState('');
    const routes = ['create', 'lobby', 'detail',]
  
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

export { isExists, useForm };
