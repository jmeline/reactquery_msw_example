import { render, screen, waitFor } from '@testing-library/react';
import {renderHook} from "@testing-library/react-hooks"
import {setupServer} from "msw/node"
import {rest} from "msw"
import App, {useCatFacts} from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const server = setupServer()
const client = new QueryClient()

beforeAll(() => server.listen({onUnhandledRequest: "warn"}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders learn react link', async() => {
  server.use(
    // rest.get("https://cat-fact.herokuapp.com/facts", (req, res, ctx) => {
    rest.get("/facts", (req, res, ctx) => {
      console.log("I HIT SOMETHING!!!")
      return res(
        ctx.status(200),
        ctx.json([
          { "text": "Dogs are better" },
          { "text": "Dogs are more loving and less evil than cats" }
        ]))
    })
  )
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );
  // screen.debug()
  expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
  expect(await screen.findByText("Dogs are better")).toBeInTheDocument();
});

test('useCatfActs hook', async () => {
  const expectedResult = [
    { "text": "Dogs are better" },
    { "text": "Dogs are more loving and less evil than cats" }
  ]
  server.use(
    // rest.get("https://cat-fact.herokuapp.com/facts", (req, res, ctx) => {
    //   console.log("I HIT SOMETHING!!!")
    //   return res(
    //     ctx.status(200),
    //     ctx.json(expectedResult))
    // })
  )
  const wrapper = ({children}) => 
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>

  const {result, waitFor} = renderHook(() => useCatFacts(), { wrapper })

  await waitFor(() => result.current.catfacts.isSuccess)

  const facts = result.current.catfacts.data.map(x => x.text)
  expect(facts).toEqual(expectedResult.map(x => x.text))

})
