// Mock API client for testing
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

// Reset all mocks before each test
export const resetApiMocks = () => {
  Object.values(mockApiClient).forEach(mock => mock.mockReset());
};

// Mock successful response
export const mockSuccessResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
});

// Mock error response
export const mockErrorResponse = (status = 500, message = 'Internal Server Error') => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
  },
});

// Mock API responses
export const mockApiResponses = {
  // Auth
  login: mockSuccessResponse({ token: 'mock-token', user: { id: 1, email: 'test@example.com' } }),
  logout: mockSuccessResponse({ message: 'Logged out successfully' }),
  
  // User
  getUser: mockSuccessResponse({ id: 1, email: 'test@example.com', name: 'Test User' }),
  updateUser: mockSuccessResponse({ id: 1, email: 'test@example.com', name: 'Updated User' }),
  
  // Content
  getContent: mockSuccessResponse({ 
    id: 1, 
    title: 'Test Content',
    content: 'Test content body',
    createdAt: '2024-01-01T00:00:00.000Z'
  }),
  
  // Error responses
  notFound: mockErrorResponse(404, 'Not Found'),
  unauthorized: mockErrorResponse(401, 'Unauthorized'),
  serverError: mockErrorResponse(500, 'Internal Server Error'),
}; 