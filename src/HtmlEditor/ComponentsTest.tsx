import React, { Box, Stack, useTheme } from '@mui/material'
import { Button } from '../components/buttons/Button/Button'
import { ButtonType } from '../components/buttons/Button/Types'
import {
  mdiAbTesting,
  mdiAlphabetLatin,
  mdiPencil,
  mdiPlusMinus,
} from '@mdi/js'

export const TestPages = () => {
  const theme = useTheme()
  console.log('Theme', theme)

  const props = {
    sx: {},
    icon: mdiPlusMinus,
    endIcon: mdiAbTesting,
    disabled: true,
  }
  const iconProps = {
    sx: {},
    icon: mdiPencil,
    color: 'secondary' as const,
    // iconColor: 'yellow',
  }
  return (
    <Box p={2} bgcolor="background.default">
      <Stack gap={2}>
        <Button {...props}>Test</Button>
        <Button type={ButtonType.secondary} {...props}>
          Testfalll 123 123 21324e{' '}
        </Button>
        <Button type={ButtonType.text} {...props}>
          Testfall 123 435 erfersf 123{' '}
        </Button>
      </Stack>

      <br />
      <br />
      <Box>
        <Button {...props}>Test</Button>
        <Button type={ButtonType.secondary} {...props}>
          Testfalll 123 123 21324e{' '}
        </Button>
        <Button type={ButtonType.text} {...props} disableHover={true}>
          Testfall 123 435 erfersf 123{' '}
        </Button>
      </Box>
      <br />
      <br />

      <Box gap={2}>
        <Button>Test</Button>
        <Button type={ButtonType.secondary}>Testfalll 123 123 21324e </Button>
        <Button type={ButtonType.text}>Testfall 123 435 erfersf 123 </Button>
      </Box>

      <Stack gap={2}>
        <Button>Test</Button>
        <Button type={ButtonType.secondary}>Testfalll 123 123 21324e </Button>
        <Button type={ButtonType.text}>Testfall 123 435 erfersf 123 </Button>
      </Stack>

      <Stack gap={2}>
        <Button iconButton {...iconProps}>
          Test
        </Button>
        <Button iconButton type={ButtonType.secondary} {...iconProps}>
          Testfalll 123 123 21324e{' '}
        </Button>
        <Button iconButton type={ButtonType.text} {...iconProps}>
          Testfall 123 435 erfersf 123{' '}
        </Button>
      </Stack>
      <Box gap={2}>
        <Button iconButton {...iconProps}>
          Test
        </Button>
        <Button iconButton type={ButtonType.secondary} {...iconProps}>
          Testfalll 123 123 21324e{' '}
        </Button>
        <Button iconButton type={ButtonType.text} {...iconProps}>
          Testfall 123 435 erfersf 123{' '}
        </Button>
      </Box>
    </Box>
  )
}
