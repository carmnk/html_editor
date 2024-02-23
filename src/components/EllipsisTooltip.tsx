import React, { useRef, useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import {
  Box,
  BoxProps,
  IconButton,
  Link as MuiLink,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { CustomCopyClipboard } from './CustomCopyClipboard'
import { mdiContentCopy } from '@mdi/js'
import Icon from '@mdi/react'

export type EllipsisTextWithTooltipProps = BoxProps & {
  label?: string
  title?: string
  spanSx?: any
  permanentTitle?: string
  to?: string
  useCopyContent?: boolean
  onClick?: () => void
  fullWidth?: boolean
  outerBoxSx?: BoxProps['sx']
  useTypography?: boolean
  typographyVariant?: TypographyProps['variant']
}

export const EllipsisTextWithTooltip = (
  props: EllipsisTextWithTooltipProps
) => {
  const {
    label,
    title,
    sx,
    spanSx,
    permanentTitle,
    to,
    useCopyContent,
    onClick,
    fullWidth,
    outerBoxSx,
    useTypography,
    typographyVariant,
  } = props
  const theme = useTheme()

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    setCopied(true)
  }, [])

  const titleAdj = !hoverStatus ? '' : (title ? title : label) || ''
  const permanentTitleAdj =
    (permanentTitle && hoverStatus ? (
      <>
        {permanentTitle}
        <br />
      </>
    ) : (
      permanentTitle
    )) || ''

  const fullTitle = (
    <>
      {permanentTitleAdj} {titleAdj}
    </>
  )
  // Create Ref
  const textElementRef = useRef<HTMLDivElement>(null)

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    const compareSize = () => {
      if (!textElementRef?.current) return
      const compare =
        textElementRef?.current?.scrollWidth >
        textElementRef?.current?.clientWidth
      setHover(compare)
    }
    compareSize()
    window.addEventListener('resize', compareSize)

    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [])

  React.useEffect(() => {
    if (!copied) return
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [copied])

  return (
    <CustomCopyClipboard
      text={typeof label === 'string' ? label : ''}
      onCopy={handleCopy}
      disableCopy={!useCopyContent || typeof label !== 'string'}
    >
      <Box
        position="relative"
        width={fullWidth ? '100%' : undefined}
        sx={outerBoxSx}
      >
        <Tooltip
          title={fullTitle}
          disableHoverListener={!hoverStatus && !permanentTitle}
          placement="top"
          arrow
          sx={{ zIndex: 1000000 }}
        >
          <Box
            ref={textElementRef}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              position: 'relative',
              ...sx,
            }}
            onClick={onClick}
          >
            {to ? (
              <Box component="span" sx={spanSx}>
                <Link to={to}>
                  <MuiLink component="div">{label}</MuiLink>
                </Link>
              </Box>
            ) : useTypography ? (
              <Typography
                variant={typographyVariant}
                component="div"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  position: 'relative',
                }}
              >
                {label}
              </Typography>
            ) : (
              <Box component="span" sx={spanSx}>
                {label}
              </Box>
            )}
          </Box>
        </Tooltip>

        {useCopyContent && (
          <Box
            position="absolute"
            top="0px"
            right="0px"
            sx={{
              transition: `opacity ${copied ? '0.8s' : '2s'} ease-out 0s`,
              opacity: copied ? 1 : 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <IconButton size="small" sx={{ background: 'white' }} tabIndex={-1}>
              <Icon path={mdiContentCopy} size={1} />
            </IconButton>
          </Box>
        )}
      </Box>
    </CustomCopyClipboard>
  )
}
