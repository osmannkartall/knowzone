/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { setupServer } from 'msw/node';
import FormCreator from '../../../components/form/FormCreator';
import FORM_COMPONENT_TYPES from '../../../components/form/formComponentTypes';
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

const mockHandler = jest.fn((type, content) => Promise.resolve({ type, content }));

describe('FormCreator', () => {
  it('should render the create form header', () => {
    render(<FormCreator open />);

    expect(screen.getByText(/create form/i)).toBeInTheDocument();
  });

  it('should change the form type name', () => {
    render(<FormCreator open />);

    const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
    fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });

    expect(formTypeNameInput).toHaveValue('test form');
  });

  it('should render 10 component type dropdowns with valid options', () => {
    render(<FormCreator open />);

    const componentTypeDropdowns = getComponentTypeDropdowns();
    const options = getMuiDropdownOptions(componentTypeDropdowns[2]);
    const optionValues = options.map((li) => li.getAttribute('data-value'));

    expect(componentTypeDropdowns.length).toBe(10);

    expect(optionValues.sort()).toEqual(['', ...Object.values(FORM_COMPONENT_TYPES)].sort());
  });

  it('should set name value to `images` when it is image component', async () => {
    render(<FormCreator open />);

    onClickMuiDropdownOption(getComponentTypeDropdowns()[2], FORM_COMPONENT_TYPES.IMAGE);

    expect(await getNameTextField(2)).toHaveValue('images');
    expect(await getNameTextField(2)).toHaveAttribute('disabled');
  });

  it('should allow other names to be modified when image component is selected', async () => {
    render(<FormCreator open />);

    onClickMuiDropdownOption(getComponentTypeDropdowns()[2], FORM_COMPONENT_TYPES.IMAGE);
    fireEvent.change(await getNameTextField(4), { target: { value: 'description' } });

    expect(await getNameTextField(4)).toHaveValue('description');
  });

  it('should disable the `image` options on the others when an image type is selected', () => {
    render(<FormCreator open />);

    const componentTypeDropdowns = getComponentTypeDropdowns();
    onClickMuiDropdownOption(componentTypeDropdowns[2], FORM_COMPONENT_TYPES.IMAGE);
    const imageOption = getComponentTypeOption(
      componentTypeDropdowns[4],
      FORM_COMPONENT_TYPES.IMAGE,
    );

    expect(imageOption).toHaveClass('Mui-disabled');
  });

  it('should submit form with only image field and form type name', async () => {
    render(<FormCreator open handler={mockHandler} />);

    const type = 'test form';

    const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
    fireEvent.change(formTypeNameInput, { target: { value: type } });

    const componentTypeDropdowns = getComponentTypeDropdowns();
    onClickMuiDropdownOption(componentTypeDropdowns[2], FORM_COMPONENT_TYPES.IMAGE);

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith({
        type,
        content: {
          k0: { name: '', type: '' },
          k1: { name: '', type: '' },
          k2: { name: '', type: FORM_COMPONENT_TYPES.IMAGE },
          k3: { name: '', type: '' },
          k4: { name: '', type: '' },
          k5: { name: '', type: '' },
          k6: { name: '', type: '' },
          k7: { name: '', type: '' },
          k8: { name: '', type: '' },
          k9: { name: '', type: '' },
        },
      });
    });
  });

  it('should submit form', async () => {
    render(<FormCreator open handler={mockHandler} />);

    const type = 'test form';

    const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
    fireEvent.change(formTypeNameInput, { target: { value: type } });

    const componentTypeDropdowns = getComponentTypeDropdowns();
    onClickMuiDropdownOption(componentTypeDropdowns[2], FORM_COMPONENT_TYPES.IMAGE);
    onClickMuiDropdownOption(componentTypeDropdowns[4], FORM_COMPONENT_TYPES.EDITOR);
    onClickMuiDropdownOption(componentTypeDropdowns[0], FORM_COMPONENT_TYPES.TEXT);

    const names = await screen.findAllByTestId('outlined-basic-name');
    fireEvent.change(names[2].querySelector('input'), { target: { value: 'images' } });
    fireEvent.change(names[4].querySelector('input'), { target: { value: 'my editor' } });
    fireEvent.change(names[0].querySelector('input'), { target: { value: 'my text' } });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith({
        type,
        content: {
          k0: { name: 'my text', type: FORM_COMPONENT_TYPES.TEXT },
          k1: { name: '', type: '' },
          // This is '' in test because of the selectedImageComponentKey internal state
          k2: { name: '', type: FORM_COMPONENT_TYPES.IMAGE },
          k3: { name: '', type: '' },
          k4: { name: 'my editor', type: FORM_COMPONENT_TYPES.EDITOR },
          k5: { name: '', type: '' },
          k6: { name: '', type: '' },
          k7: { name: '', type: '' },
          k8: { name: '', type: '' },
          k9: { name: '', type: '' },
        },
      });
    });
  });

  it('should throw error when trying to create form without the form type name', async () => {
    render(<FormCreator open handler={mockHandler} />);

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
      screen.getByText(/At least one name and type required./i);
    });
  });

  it('should throw error when trying to create form with the same form field name', async () => {
    render(<FormCreator open handler={mockHandler} />);

    const formTypeNameInput = screen.getByRole('textbox', { name: /form type name/i });
    fireEvent.change(formTypeNameInput, { target: { value: 'test form' } });

    const componentTypeDropdowns = getComponentTypeDropdowns();
    onClickMuiDropdownOption(componentTypeDropdowns[0], FORM_COMPONENT_TYPES.EDITOR);
    onClickMuiDropdownOption(componentTypeDropdowns[1], FORM_COMPONENT_TYPES.TEXT);

    const names = await screen.findAllByTestId('outlined-basic-name');
    fireEvent.change(names[0].querySelector('input'), { target: { value: 'description' } });
    fireEvent.change(names[1].querySelector('input'), { target: { value: 'description' } });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(1);
      screen.getByText(/Each name of form field must be unique/i);
    });
  });

  it('should display preview of the selected component types by preserving order', async () => {
    render(<FormCreator open />);

    const componentTypeDropdowns = getComponentTypeDropdowns();
    onClickMuiDropdownOption(componentTypeDropdowns[0], FORM_COMPONENT_TYPES.EDITOR);
    onClickMuiDropdownOption(componentTypeDropdowns[3], FORM_COMPONENT_TYPES.TEXT);
    const componentTypePreviews = getComponentTypePreviews();

    expect(componentTypePreviews.length).toBe(2);
    await within(componentTypePreviews[0]).findByText(/this is an editor/i);
    await within(componentTypePreviews[1]).findByText(/this is a text/i);

    onClickMuiDropdownOption(componentTypeDropdowns[1], FORM_COMPONENT_TYPES.LIST);
    const newComponentTypePreviews = getComponentTypePreviews();

    expect(newComponentTypePreviews.length).toBe(3);
    await within(newComponentTypePreviews[0]).findByText(/this is an editor/i);
    await within(newComponentTypePreviews[1]).findByText(/example1/i);
    await within(newComponentTypePreviews[2]).findByText(/this is a text/i);
  });
});
