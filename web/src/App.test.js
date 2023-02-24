import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const paragraph = screen.getByText(/hi. this is your knowzone/i);
  expect(paragraph).toBeInTheDocument();
});
