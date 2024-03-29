/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/lib/node';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import api from '../../../__mocks__/api';
import PostCreator from '../../../components/post/PostCreator';
import { forms } from '../../../__mocks__/data';
import { expectFormInputsAreInDocument, expectFormInputsAreNotInDocument } from '../../utils';
import postCreatorSchema from '../../../components/post/postCreatorSchema';
import VALIDATION_MESSAGES from '../../../common/validationMessages';
import POST_SCHEMA_CONFIGS from '../../../components/post/postSchemaConfigs';
import { NUMERIC_KEY_PREFIX, addNumericKeyPrefix } from '../../../components/post/postCreatorUtils';

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

describe('PostCreator', () => {
  it('should create the post', async () => {
    const { type } = forms.bugfix;

    const file1 = new File(['file1'], 'file1.png', { type: 'image/png' });
    const file2 = new File(['file2'], 'file2.png', { type: 'image/png' });

    const expectedPost = {
      type: forms.bugfix.type,
      content: addNumericKeyPrefix(
        {
          description: 'This is the description of the error',
          links: undefined,
          error: '## Error: ...',
          solution: '## solution for the error',
          images: [file1, file2],
        },
      ),
      topics: ['topic1', 'topic2'],
    };

    window.URL.createObjectURL = jest.fn();

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type, topics: [], content: {} },
      });

      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms.bugfix}
            handler={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    const { user } = setup(<Component />);

    const descriptionInput = screen.getByLabelText(/description/i);
    const errorInput = screen.getByLabelText(/error/i);
    const solutionInput = screen.getByLabelText(/solution/i);
    const topicsInput = screen.getByLabelText(/topics/i);
    const shareButton = screen.getByText(/share/i);
    const imageUploaderInput = screen.getByLabelText(/images/i);
    const dragAndDropText = screen.queryByText(/Drag n drop some images here, or click to select/i);

    await user.type(descriptionInput, expectedPost.content[`${NUMERIC_KEY_PREFIX}description`]);
    await user.type(errorInput, expectedPost.content[`${NUMERIC_KEY_PREFIX}error`]);
    await user.type(solutionInput, expectedPost.content[`${NUMERIC_KEY_PREFIX}solution`]);
    await user.upload(imageUploaderInput, [file1, file2]);
    await user.type(topicsInput, 'topic1');
    fireEvent.keyDown(topicsInput, { key: 'Enter' });
    await user.type(topicsInput, 'topic2');
    fireEvent.keyDown(topicsInput, { key: 'Enter' });

    fireEvent.submit(shareButton);

    expect(imageUploaderInput.files[0]).toBe(file1);
    expect(imageUploaderInput.files[1]).toBe(file2);
    await waitFor(() => expect(dragAndDropText).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));

    expect(mockOnSubmit).toBeCalledWith(expectedPost);

    window.URL.createObjectURL.mockReset();
  });

  it('should display error when all the content fields are empty', async () => {
    const { type } = forms.tip;

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
            handler={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    render(<Component />);

    fireEvent.submit(screen.getByText(/share/i));

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(2));

    expect(mockOnSubmit).not.toBeCalled();
  });

  it('should render the default header when there is no form', () => {
    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: { name: '' } },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open />
        </FormProvider>
      );
    }

    render(<Component />);

    screen.getByRole('heading', { name: /create/i });
  });

  it('should change component types according to selected form type', () => {
    function Component({ type }) {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open form={forms[type.name]} />
        </FormProvider>
      );
    }

    const { rerender } = render(<Component type={forms.tip.type} />);

    expectFormInputsAreInDocument(Object.keys(forms.tip.content));

    rerender(<Component type={forms.todo.type} />);

    expectFormInputsAreInDocument(Object.keys(forms.todo.content));
    expectFormInputsAreNotInDocument(Object.keys(forms.tip.content));
  });

  it('should display only topics error when only content.images is filled', async () => {
    window.URL.createObjectURL = jest.fn();

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: { name: '' }, topics: [] },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms.tip}
            handler={mockOnSubmit}
          />
        </FormProvider>
      );
    }
    const { user } = setup(<Component />);

    expect(screen.queryByText(/at least one content field must be filled/i)).not.toBeInTheDocument();

    const uploader = screen.getByLabelText(/images/i);
    const file = new File(['pixels'], 'test.png', { type: 'image/png' });
    await user.upload(uploader, file);
    fireEvent.submit(screen.getByText(/share/i));

    expect(uploader.files[0]).toBe(file);
    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(1));
    screen.getByText(VALIDATION_MESSAGES.MIN_NUM('topics', POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS));
    expect(mockOnSubmit).not.toBeCalled();

    window.URL.createObjectURL.mockReset();
  });

  it('should display error when there is an invalid topic', async () => {
    window.URL.createObjectURL = jest.fn();

    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: { name: '' }, topics: [] },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator
            open
            form={forms.todo}
            handler={mockOnSubmit}
          />
        </FormProvider>
      );
    }

    const { user } = setup(<Component />);

    const itemInput = screen.getByLabelText(/item/i);
    const topicsInput = screen.getByLabelText(/topics/i);
    const shareButton = screen.getByText(/share/i);

    await user.type(itemInput, 'first todo');
    await user.type(topicsInput, 'topic_?');
    fireEvent.keyDown(topicsInput, { key: 'Enter' });

    fireEvent.submit(shareButton);

    await waitFor(() => expect(screen.getByText(/A topic should be at most 30 alphanumeric/i)));
  });

  it('should render the empty form', async () => {
    function Component() {
      const methods = useForm({
        resolver: joiResolver(postCreatorSchema),
        defaultValues: { type: { name: '' } },
      });
      return (
        <FormProvider {...methods}>
          <PostCreator open handler={mockOnSubmit} />
        </FormProvider>
      );
    }

    render(<Component />);

    fireEvent.submit(screen.getByText(/share/i));

    await waitFor(() => expect(mockOnSubmit).not.toBeCalled());
  });
});
