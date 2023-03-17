/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { setupServer } from 'msw/node';
import FormBuilder from '../../../components/form/FormBuilder';
import FORM_COMPONENT_TYPES from '../../../constants/form-components-types';
import api from '../../../__mocks__/api';
import {
  getMuiDropdownByTestId,
  getMuiDropdownOptionByValue,
  getMuiDropdownOptions,
  onClickMuiDropdownOption,
} from '../../utils';

function getComponentTypeDropdowns() {
  return getMuiDropdownByTestId('outlined-select-component-type');
}

function getComponentTypePreviews() {
  return screen.getAllByTestId('component-type-preview');
}

async function getNameTextField(index) {
  const names = await screen.findAllByTestId('outlined-basic-name');
  return names[index].querySelector('input');
}

function getComponentTypeOption(dropdown, componentType) {
  return getMuiDropdownOptionByValue(getMuiDropdownOptions(dropdown), componentType);
}

const server = setupServer(...api);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('render the create form header', () => {
  render(<FormBuilder open />);

  expect(screen.getByText(/create form/i)).toBeInTheDocument();
});

test('change the form type name', () => {
  render(<FormBuilder open />);

  const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
  fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });

  expect(formTypeNameInput).toHaveValue('test form');
});

test('render 10 component type dropdowns with valid options', () => {
  render(<FormBuilder open />);

  const componentTypeDropdowns = getComponentTypeDropdowns();
  const options = getMuiDropdownOptions(componentTypeDropdowns[2]);
  const optionValues = options.map((li) => li.getAttribute('data-value'));

  expect(componentTypeDropdowns.length).toBe(10);

  expect(optionValues.sort()).toEqual(['', ...Object.values(FORM_COMPONENT_TYPES)].sort());
});

test('value of the name is images and name is disabled when component type is image', async () => {
  render(<FormBuilder open />);

  onClickMuiDropdownOption(getComponentTypeDropdowns()[2], FORM_COMPONENT_TYPES.IMAGE);

  expect(await getNameTextField(2)).toHaveValue('images');
  expect(await getNameTextField(2)).toHaveAttribute('disabled');
});

test('other name fields can be changeable when value of a name textfield is images', async () => {
  render(<FormBuilder open />);

  onClickMuiDropdownOption(getComponentTypeDropdowns()[2], FORM_COMPONENT_TYPES.IMAGE);
  fireEvent.change(await getNameTextField(4), { target: { value: 'description' } });

  expect(await getNameTextField(4)).toHaveValue('description');
});

test('image options in other dropdowns are disabled when it is selected in any dropdown', () => {
  render(<FormBuilder open />);

  const componentTypeDropdowns = getComponentTypeDropdowns();
  onClickMuiDropdownOption(componentTypeDropdowns[2], FORM_COMPONENT_TYPES.IMAGE);
  const imageOption = getComponentTypeOption(componentTypeDropdowns[4], FORM_COMPONENT_TYPES.IMAGE);

  expect(imageOption).toHaveClass('Mui-disabled');
});

test('submit form with only (images: image) field and form type name', async () => {
  const setOpenMock = jest.fn();
  const setSidebarItemsMock = jest.fn();
  render(<FormBuilder open setOpen={setOpenMock} setSidebarItems={setSidebarItemsMock} />);

  const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
  fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });
  const componentTypeDropdowns = getComponentTypeDropdowns();
  onClickMuiDropdownOption(componentTypeDropdowns[2], FORM_COMPONENT_TYPES.IMAGE);
  const buttonCreateForm = screen.getByText('Create');
  fireEvent.click(buttonCreateForm);

  await waitFor(() => {
    expect(setOpenMock).toHaveBeenCalledWith(false);
    expect(setSidebarItemsMock).toHaveBeenCalled();
  });
});

test('throw error when trying to create form without the form type name', async () => {
  render(<FormBuilder open />);

  const logSpy = jest.spyOn(console, 'log');
  const buttonCreateForm = screen.getByText('Create');
  fireEvent.click(buttonCreateForm);

  await waitFor(() => {
    expect(logSpy.mock.calls[0][0].message).toBe('Form type name is required');
  });

  logSpy.mockReset();
});

test('throw error when trying to create form with the same form field name', async () => {
  render(<FormBuilder open />);

  const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
  fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });
  const componentTypeDropdowns = getComponentTypeDropdowns();
  onClickMuiDropdownOption(componentTypeDropdowns[0], FORM_COMPONENT_TYPES.EDITOR);
  onClickMuiDropdownOption(componentTypeDropdowns[1], FORM_COMPONENT_TYPES.TEXT);
  const names = await screen.findAllByTestId('outlined-basic-name');
  fireEvent.change(names[0].querySelector('input'), { target: { value: 'description' } });
  fireEvent.change(names[1].querySelector('input'), { target: { value: 'description' } });
  const logSpy = jest.spyOn(console, 'log');
  const buttonCreateForm = screen.getByText('Create');
  fireEvent.click(buttonCreateForm);

  await waitFor(() => {
    expect(logSpy.mock.calls[0][0].message).toBe('Each name of form field must be unique');
  });

  logSpy.mockReset();
});

test('display preview of the selected component types by preserving order', async () => {
  render(<FormBuilder open />);

  const componentTypeDropdowns = getComponentTypeDropdowns();
  onClickMuiDropdownOption(componentTypeDropdowns[0], FORM_COMPONENT_TYPES.EDITOR);
  onClickMuiDropdownOption(componentTypeDropdowns[3], FORM_COMPONENT_TYPES.TEXT);
  const componentTypePreviews = getComponentTypePreviews();

  expect(componentTypePreviews.length).toBe(2);
  await within(componentTypePreviews[0]).findByText(/this is a markdown editor/i);
  await within(componentTypePreviews[1]).findByText(/this is a text/i);

  onClickMuiDropdownOption(componentTypeDropdowns[1], FORM_COMPONENT_TYPES.LIST);
  const newComponentTypePreviews = getComponentTypePreviews();

  expect(newComponentTypePreviews.length).toBe(3);
  await within(newComponentTypePreviews[0]).findByText(/this is a markdown editor/i);
  await within(newComponentTypePreviews[1]).findByText(/example1/i);
  await within(newComponentTypePreviews[2]).findByText(/this is a text/i);
});
