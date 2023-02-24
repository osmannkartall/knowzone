import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { setupServer } from 'msw/node';
import FormBuilder from '../../../components/form/FormBuilder';
// eslint-disable-next-line jest/no-mocks-import
import api from '../../../__mocks__/api';

const server = setupServer(...api);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('FormBuilder', async () => {
  const setOpenMock = jest.fn();
  const setSidebarItemsMock = jest.fn();

  render(<FormBuilder open setOpen={setOpenMock} setSidebarItems={setSidebarItemsMock} />);

  // Create Form Header
  expect(screen.getByText(/create form/i)).toBeInTheDocument();

  // Form Type Name Input
  const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
  fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });

  expect(formTypeNameInput).toHaveValue('test form');

  // Component Type Dropdowns and Names
  const componentTypeDropdowns = screen.getAllByTestId('outlined-select-component-type');
  let current = 2;
  let button = within(componentTypeDropdowns[current]).getByRole('button');
  fireEvent.mouseDown(button);
  const listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  const options = within(listbox).getAllByRole('option');
  const optionValues = options.map((li) => li.getAttribute('data-value'));

  // 10 dropdowns with valid component type options
  expect(componentTypeDropdowns.length).toBe(10);
  expect(optionValues).toEqual(['', 'editor', 'list', 'text', 'image']);

  // name with value images as disabled when image component type option is selected
  const imageOption = options.find((li) => li.getAttribute('data-value') === 'image');
  fireEvent.click(imageOption);
  const names = await screen.findAllByTestId('outlined-basic-name');
  let currentNameInput = names[current].querySelector('input');

  expect(currentNameInput).toHaveValue('images');
  expect(currentNameInput).toHaveAttribute('disabled');

  // image option as disabled in other dropdowns when it is selected in any dropdown
  current = 4;
  button = within(componentTypeDropdowns[current]).getByRole('button');
  fireEvent.mouseDown(button);

  expect(imageOption).toHaveClass('Mui-disabled');

  // change value of name field when component type is not image
  currentNameInput = names[current].querySelector('input');
  fireEvent.change(currentNameInput, { target: { value: 'description' } });

  expect(currentNameInput).toHaveValue('description');

  // FormBuilder - submit form with only images field and form type name
  const buttonCreateForm = screen.getByText('Create');
  fireEvent.click(buttonCreateForm);
  await waitFor(() => {
    expect(setOpenMock).toHaveBeenCalledWith(false);
    expect(setSidebarItemsMock).toHaveBeenCalled();
  });
});

test('should throw error when trying to create form without form type name', async () => {
  render(<FormBuilder open />);

  const logSpy = jest.spyOn(console, 'log');
  const buttonCreateForm = screen.getByText('Create');
  fireEvent.click(buttonCreateForm);
  await waitFor(() => {
    expect(logSpy.mock.calls[0][0].message).toBe('Form type name is required');
  });

  logSpy.mockReset();
});

test('should throw error when trying to create form with same form field name', async () => {
  render(<FormBuilder open />);
  const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
  fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });

  const componentTypeDropdowns = screen.getAllByTestId('outlined-select-component-type');

  fireEvent.mouseDown(within(componentTypeDropdowns[0]).getByRole('button'));
  let listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  let options = within(listbox).getAllByRole('option');
  fireEvent.click(options.find((li) => li.getAttribute('data-value') === 'editor'));

  fireEvent.mouseDown(within(componentTypeDropdowns[1]).getByRole('button'));
  listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  options = within(listbox).getAllByRole('option');
  fireEvent.click(options.find((li) => li.getAttribute('data-value') === 'text'));

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

test('should display preview of selected component types by preserving order', async () => {
  render(<FormBuilder open />);

  const componentTypeDropdowns = screen.getAllByTestId('outlined-select-component-type');

  fireEvent.mouseDown(within(componentTypeDropdowns[0]).getByRole('button'));
  let listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  let options = within(listbox).getAllByRole('option');
  fireEvent.click(options.find((li) => li.getAttribute('data-value') === 'editor'));

  fireEvent.mouseDown(within(componentTypeDropdowns[3]).getByRole('button'));
  listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  options = within(listbox).getAllByRole('option');
  fireEvent.click(options.find((li) => li.getAttribute('data-value') === 'text'));

  let componentTypePreviews = screen.getAllByTestId('component-type-preview');
  expect(componentTypePreviews.length).toBe(2);

  await within(componentTypePreviews[0]).findByText(/This is a markdown editor/i);
  await within(componentTypePreviews[1]).findByText(/This is a text/i);

  fireEvent.mouseDown(within(componentTypeDropdowns[1]).getByRole('button'));
  listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  options = within(listbox).getAllByRole('option');
  fireEvent.click(options.find((li) => li.getAttribute('data-value') === 'list'));

  componentTypePreviews = screen.getAllByTestId('component-type-preview');
  expect(componentTypePreviews.length).toBe(3);

  await within(componentTypePreviews[0]).findByText(/This is a markdown editor/i);
  await within(componentTypePreviews[1]).findByText(/example1/i);
  await within(componentTypePreviews[2]).findByText(/This is a text/i);
});
