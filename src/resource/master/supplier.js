import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { error } from '../constants'
import { Toaster } from '../utils'
import $axios from '../../Api'

export const getCustomerV2 = async (property = {}, useAlert = true) => {
  var defaultParam = {
    ApiName: 'ListCustomer',
    Params: JSON.stringify(property),
    Id: property.id ?? null,
  }
  var query_string = new URLSearchParams(defaultParam).toString()
  return new Promise((resolve) => {
    $axios
      .get(`/api/general/mobile?${query_string}`)
      .then((result) => {
        if (result.data.error && useAlert) {
          Toaster({ message: `${result.data.message}`, type: 'error' })
          return resolve(false)
        }
        return resolve(result.data.data)
      })
      .catch((e) => {
        if (useAlert) Toaster({ message: `${e.message}`, type: 'error' })
        return resolve(false)
      })
  })
}
