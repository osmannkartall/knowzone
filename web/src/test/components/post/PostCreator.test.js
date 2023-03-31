/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
import { VALIDATION_MESSAGES } from '../../../schemas/validationMessages';
import { POST_SCHEMA_CONFIGS } from '../../../schemas/schemaConfigs';

const server = setupServer(...api);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const mockOnSubmit = jest.fn((type, content, topics) => Promise.resolve({ type, content, topics }));

const mockSetForm = jest.fn((form) => Promise.resolve(form));

describe('PostCreator', () => {
  it('should create the post', async () => {
    const type = 'bugfix';

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

    const { user } = setup(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);

    // Inputs are rendered after a post type selected.
    const descriptionInput = screen.getByLabelText(/description/i);
    const errorInput = screen.getByLabelText(/error/i);
    const solutionInput = screen.getByLabelText(/solution/i);
    const topicsInput = screen.getByLabelText(/topics/i);
    const shareButton = screen.getByText(/share/i);
    const imageUploaderInput = screen.getByLabelText(/images/i);
    const dragAndDropText = screen.queryByText(/Drag n drop some images here, or click to select/i);

    await user.type(descriptionInput, expectedPost.content.description);
    await user.type(errorInput, expectedPost.content.error);
    await user.type(solutionInput, expectedPost.content.solution);
    await user.upload(imageUploaderInput, [file1, file2]);
    await user.type(topicsInput, 'topic1');
    fireEvent.keyDown(topicsInput, { key: 'enter', keyCode: 13 });
    await user.type(topicsInput, 'topic2');
    fireEvent.keyDown(topicsInput, { key: 'enter', keyCode: 13 });

    fireEvent.submit(shareButton);

    expect(imageUploaderInput.files[0]).toBe(file1);
    expect(imageUploaderInput.files[1]).toBe(file2);
    await waitFor(() => expect(dragAndDropText).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(mockOnSubmit).toBeCalledWith(expectedPost);

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
    const { user } = setup(<Component />);

    expect(screen.queryByText(/at least one content field must be filled/i)).not.toBeInTheDocument();

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);

    const uploader = screen.getByLabelText(/images/i);
    const file = new File(['pixels'], 'test.png', { type: 'image/png' });
    await user.upload(uploader, file);
    fireEvent.submit(screen.getByText(/share/i));

    await expectMuiDropdownHasSelectedValue(/post type/i, type);
    expect(uploader.files[0]).toBe(file);
    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(1));
    screen.getByText(VALIDATION_MESSAGES.MIN_NUM('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS));
    expect(mockOnSubmit).not.toBeCalled();

    window.URL.createObjectURL.mockReset();
  });

  it('should display error when there is an invalid topic', async () => {
    const type = 'todo';

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

    const { user } = setup(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);

    const itemInput = screen.getByLabelText(/item/i);
    const topicsInput = screen.getByLabelText(/topics/i);
    const shareButton = screen.getByText(/share/i);

    await user.type(itemInput, 'first todo');
    await user.type(topicsInput, 'topic_?');
    fireEvent.keyDown(topicsInput, { key: 'enter', keyCode: 13 });

    fireEvent.submit(shareButton);

    await waitFor(() => expect(screen.getByText(/A topic should be at most 30 alphanumeric/i)));
  });

  it('should display error when there are duplicated topics', async () => {
    const type = 'todo';
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
    const { user } = setup(<Component />);

    onClickMuiDropdownOption(screen.getByTestId('select-post-type'), type);

    const itemInput = screen.getByLabelText(/item/i);
    const topicsInput = screen.getByLabelText(/topics/i);
    const shareButton = screen.getByText(/share/i);

    await user.type(itemInput, 'first todo');
    await user.type(topicsInput, 'duplicated-topic');
    fireEvent.keyDown(topicsInput, { key: 'enter', keyCode: 13 });
    await user.type(topicsInput, 'duplicated-topic');
    fireEvent.keyDown(topicsInput, { key: 'enter', keyCode: 13 });
    fireEvent.submit(shareButton);

    await waitFor(() => expect(screen.getByText(/Tag list should contain unique items/i)));
  });
});
