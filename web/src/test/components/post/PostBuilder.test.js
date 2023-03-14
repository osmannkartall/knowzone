/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/lib/node';
import { FormProvider, useForm } from 'react-hook-form';
import api from '../../../__mocks__/api';
import PostBuilder from '../../../components/post/PostBuilder';
import { forms, formTypes } from '../../../__mocks__/data';
import {
  getMuiDropdownOptions,
  getMuiDropdownOptionValues,
  getMuiDropdownOptionByValue,
  onClickMuiDropdownOption,
  expectFormInputsAreInDocument,
  expectFormInputsAreNotInDocument,
} from '../../utils';

const server = setupServer(...api);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const RHFFormProvider = ({ children }) => {
  const methods = useForm({ defaultValues: { type: '' } });
  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

const mockOnSubmit = jest.fn(
  (type, content, topics) => Promise.resolve({ type, content, topics }),
);

const mockSetForm = jest.fn((form) => Promise.resolve(form));

test('should render the header with the given title', () => {
  render(<RHFFormProvider><PostBuilder open title="my type" /></RHFFormProvider>);

  screen.getByRole('heading', { name: /my type/i });
});

test('should render the empty form', async () => {
  render(
    <RHFFormProvider>
      <PostBuilder open title="my type" onSubmit={mockOnSubmit} />
    </RHFFormProvider>,
  );

  const postTypeDropdown = screen.getByTestId('outlined-select-post-type');
  const options = getMuiDropdownOptions(postTypeDropdown);
  const optionValues = getMuiDropdownOptionValues(options);

  expect(optionValues).toEqual(['']);
  expect(getMuiDropdownOptionByValue(options, '')).toHaveClass('Mui-disabled');

  fireEvent.submit(screen.getByText(/share/i));

  await waitFor(() => expect(mockOnSubmit).not.toBeCalled());
});

test('should change component types according to selected form type', () => {
  const { rerender } = render(
    <RHFFormProvider>
      <PostBuilder open form={forms.tip} setForm={mockSetForm} formTypes={formTypes} />
    </RHFFormProvider>,
  );

  expectFormInputsAreInDocument(Object.keys(forms.tip.fields));

  rerender(
    <RHFFormProvider>
      <PostBuilder open form={forms.todo} setForm={mockSetForm} formTypes={formTypes} />
    </RHFFormProvider>,
  );

  expectFormInputsAreInDocument(Object.keys(forms.todo.fields));
  expectFormInputsAreNotInDocument(Object.keys(forms.tip.fields));
});

test('should change the form after selected type is changed', async () => {
  const type = 'tip';
  const selectedFormType = formTypes.find((i) => i.type === type);
  const selectedForm = forms[type];

  render(
    <RHFFormProvider>
      <PostBuilder open form={{}} setForm={mockSetForm} formTypes={formTypes} />
    </RHFFormProvider>,
  );

  onClickMuiDropdownOption(screen.getByTestId('outlined-select-post-type'), selectedFormType.type);

  await waitFor(() => expect(mockSetForm).toHaveBeenCalledWith(selectedForm));
});

test('should create the post', () => {
  // update and create differs in terms of props. Check <Sidebar />
});

test('should update the post', () => {
  // update and create differs in terms of props. Check <Posts />
});
