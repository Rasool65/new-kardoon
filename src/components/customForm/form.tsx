import JSONForm, { AjvError, IChangeEvent, ISubmitEvent, UiSchema } from '@rjsf/core';
import type { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
};

const uiSchema: UiSchema = {};

export function Form() {
  const onSubmit = (event: ISubmitEvent<unknown>) => {
    // console.log('submit', event.formData);
  };

  const onChange = (event: IChangeEvent<unknown>) => {
    // console.log('change', event.formData);
  };

  const onError = (errors: AjvError[]) => {
    // console.error(errors);
  };

  return <JSONForm schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} onChange={onChange} onError={onError} />;
}
