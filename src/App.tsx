import '@mantine/core/styles.css';

import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

export default function App() {

  function Demo() {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>
  
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge color="pink">On Sale</Badge>
        </Group>
  
        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes with tours and
          activities on and around the fjords of Norway
        </Text>
  
        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    );
  }
  
  return <MantineProvider>
    <Demo/>
    {/* <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </> */}
  </MantineProvider>;
}

