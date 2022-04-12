import { useContext } from 'react';
import { MetaFieldset } from './meta-parser';
import { useFormikContext } from 'formik';
import { MetaFieldsContext } from './MetaFieldsContext';
import get from 'lodash.get';
import isObject from 'lodash.isobject';
import setWith from 'lodash.setwith';

export function useMetaFieldsContext(fieldset: MetaFieldset | null) {
  const formikContext = useFormikContext();
  const ctx = useContext(MetaFieldsContext);

  const changeFormikValues = (key: string) => {
    if (key && fieldset) {
      const values = JSON.parse(JSON.stringify(formikContext.values));
      const rootlessPath = fieldset.__path.replace('__root.', '');
      const val = get(ctx.__values, rootlessPath);
      if (isObject(val)) {
        setWith(
          values,
          fieldset.__path,
          {
            [key]: val[key],
          },
          Object
        );
      }
      if (JSON.stringify(formikContext.values !== JSON.stringify(values))) {
        formikContext.resetForm({
          values,
        });
      }
    }
  };

  return changeFormikValues;
}
