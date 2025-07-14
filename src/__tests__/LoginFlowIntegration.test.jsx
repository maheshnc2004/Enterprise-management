// src/__tests__/LoginFlowIntegration.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const testEmployee = {
  id: 'emp1',
  name: 'Test Employee',
  email: 'employee@example.com',
  password: '1234',
  role: 'employee',
};

describe('🔒 Employee Login Flow Integration Test', () => {
  it('✅ logs in and redirects to Employee Dashboard', async () => {
    const store = mockStore({
      auth: { user: testEmployee, isAuthenticated: true },
      users: { users: [testEmployee] },
      tasks: { tasks: [] },
      projects: { projects: [] },
      notifications: { notifications: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/employee']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Employee Dashboard/i)).toBeInTheDocument();
  });
});
