import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders welcome message', () => {
  render(<App />);
  const paragraph = screen.getByText(/Login to your Knowzone account/i);
  expect(paragraph).toBeInTheDocument();
});
