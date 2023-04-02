import { fireEvent, within, screen } from '@testing-library/react';

export function getMuiDropdownByTestId(id) {
  return screen.getAllByTestId(id);
}

export function getMuiDropdownOptions(dropdown) {
  fireEvent.mouseDown(within(dropdown).getByRole('button'));
  const listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  return within(listbox).getAllByRole('option');
}

export function getMuiDropdownOptionValues(dropdownOptions) {
  return dropdownOptions.map((li) => li.getAttribute('data-value'));
}

export function getMuiDropdownOptionByValue(dropdownOptions, value) {
  return dropdownOptions.find((li) => li.getAttribute('data-value') === value);
}

export function onClickMuiDropdownOption(dropdown, optionValue) {
  const muiDropdownOptions = getMuiDropdownOptions(dropdown);
  fireEvent.click(muiDropdownOptions.find((li) => li.getAttribute('data-value') === optionValue));
}

export function expectFormInputsAreInDocument(keys) {
  (keys || []).forEach((key) => {
    expect(screen.queryByTitle(new RegExp(`${key}`, 'i'))).toBeInTheDocument();
  });
}

export function expectFormInputsAreNotInDocument(keys) {
  (keys || []).forEach((key) => {
    expect(screen.queryByTitle(new RegExp(`${key}`, 'i'))).not.toBeInTheDocument();
  });
}

export async function expectMuiDropdownHasSelectedValue(dropdown, content) {
  expect(await within(dropdown).findByRole('button')).toHaveTextContent(content);
}
