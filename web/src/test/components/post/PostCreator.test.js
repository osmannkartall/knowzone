/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/lib/node';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import api from '../../../__mocks__/api';
import PostCreator from '../../../components/post/PostCreator';
import { forms, formTypes } from '../../../__mocks__/data';
import {
  getMuiDropdownOptions,
  getMuiDropdownOptionValues,
  getMuiDropdownOptionByValue,
  onClickMuiDropdownOption,
  expectFormInputsAreInDocument,
  expectFormInputsAreNotInDocument,
  expectMuiDropdownHasSelectedValue,
} from '../../utils';
import postCreatorSchema from '../../../schemas/postCreatorSchema';

const server = setupServer(...api);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockOnSubmit = jest.fn((type, content, topics) => Promise.resolve({ type, content, topics }));

const mockSetForm = jest.fn((form) => Promise.resolve(form));

describe('PostCreator', () => {
  it('should create the post', async () => {
    const type = 'bugfix';

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '', topics: ['topic1', 'topic2'] },
      });

      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms[type]}
            setForm={mockSetForm}
            formTypes={formTypes}
            onSubmit={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    const file1 = new File(['file1'], 'file1.png', { type: 'image/png' });
    const file2 = new File(['file2'], 'file2.png', { type: 'image/png' });

    const expectedPost = {
      type,
      content: {
        description: 'This is the description of the error',
        links: undefined,
        error: '## Error: ...',
        solution: '## solution for the error',
        images: [file1, file2],
      },
      topics: ['topic1', 'topic2'],
    };

    window.URL.createObjectURL = jest.fn();

    render(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: {
        value: expectedPost.content.description,
      },
    });

    fireEvent.change(screen.getByLabelText(/error/i), {
      target: {
        value: expectedPost.content.error,
      },
    });

    fireEvent.change(screen.getByLabelText(/solution/i), {
      target: {
        value: expectedPost.content.solution,
      },
    });

    const uploader = screen.getByLabelText(/images/i);

    await waitFor(async () => {
      await fireEvent.change(uploader, { target: { files: [file1, file2] } });

      expect(uploader.files[0]).toBe(file1);
      expect(uploader.files[1]).toBe(file2);

      // no available dropzone after uploading 2 files
      expect(
        screen.queryByText(/Drag n drop some images here, or click to select/i),
      ).not.toBeInTheDocument();

      fireEvent.submit(screen.getByText(/share/i));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toBeCalledWith(expectedPost);
    });

    window.URL.createObjectURL.mockReset();
  });

  it('should set submit button to disabled when form type is not selected', () => {
    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '' },
      });

      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms.tip}
            setForm={mockSetForm}
            formTypes={formTypes}
            onSubmit={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    render(<Component />);

    expect(screen.getByRole('button', { name: /share/i })).toHaveClass('Mui-disabled');
  });

  it('should display error when all the content fields are empty', async () => {
    const type = 'tip';

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type },
      });

      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms.tip}
            setForm={mockSetForm}
            formTypes={formTypes}
            onSubmit={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    render(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);
    await expectMuiDropdownHasSelectedValue(/post type/i, type);

    fireEvent.submit(screen.getByText(/share/i));

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(2));

    expect(mockOnSubmit).not.toBeCalled();
  });

  it('should render the header with the given title', () => {
    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '' },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open title="my type" />
        </FormProvider>
      );
    }

    render(<Component />);

    screen.getByRole('heading', { name: /my type/i });
  });

  it('should render the empty form', async () => {
    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '' },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open title="my type" onSubmit={mockOnSubmit} />
        </FormProvider>
      );
    }

    render(<Component />);

    const postTypeDropdown = screen.getByTestId('select-post-type');
    const options = getMuiDropdownOptions(postTypeDropdown);
    const optionValues = getMuiDropdownOptionValues(options);

    expect(optionValues).toEqual(['']);
    expect(getMuiDropdownOptionByValue(options, '')).toHaveClass('Mui-disabled');

    fireEvent.submit(screen.getByText(/share/i));

    await waitFor(() => expect(mockOnSubmit).not.toBeCalled());
  });

  it('should change component types according to selected form type', () => {
    function Component({ type }) {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open form={forms[type]} setForm={mockSetForm} formTypes={formTypes} />
        </FormProvider>
      );
    }

    const { rerender } = render(<Component type="tip" />);

    expectFormInputsAreInDocument(Object.keys(forms.tip.content));

    rerender(<Component type="todo" />);

    expectFormInputsAreInDocument(Object.keys(forms.todo.content));
    expectFormInputsAreNotInDocument(Object.keys(forms.tip.content));
  });

  it('should change the form after the selected type is changed', async () => {
    const type = 'tip';
    const selectedFormType = formTypes.find((i) => i.type === type);
    const selectedForm = forms[type];

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '' },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open form={{}} setForm={mockSetForm} formTypes={formTypes} />
        </FormProvider>
      );
    }

    render(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), selectedFormType.type);

    await waitFor(() => expect(mockSetForm).toHaveBeenCalledWith(selectedForm));
  });

  it('should display only topics error when only content.images is filled', async () => {
    const type = 'tip';

    window.URL.createObjectURL = jest.fn();

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: '' },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms[type]}
            setForm={mockSetForm}
            formTypes={formTypes}
            onSubmit={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    render(<Component />);

    expect(screen.queryByText(/at least one content field must be filled/i)).not.toBeInTheDocument();

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);
    await expectMuiDropdownHasSelectedValue(/post type/i, type);

    await waitFor(async () => {
      const uploader = screen.getByLabelText(/images/i);
      const file = new File(['pixels'], 'test.png', { type: 'images/png' });

      await fireEvent.change(uploader, { target: { files: [file] } });

      expect(uploader.files[0]).toBe(file);
    });

    fireEvent.submit(screen.getByText(/share/i));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(1);
      screen.getByText(/at least one topic must be added/i);
    });

    expect(mockOnSubmit).not.toBeCalled();

    window.URL.createObjectURL.mockReset();
  });
});
