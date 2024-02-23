import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export const CustomCopyClipboard: React.FC<CopyToClipboard.Props & { disableCopy?: boolean }> = (
  props: CopyToClipboard.Props & { disableCopy?: boolean }
) =>
  props?.disableCopy ? (
    (props?.children as any)
  ) : (
    <CopyToClipboard text={props?.text ?? ''} onCopy={props?.onCopy}>
      {props?.children}
    </CopyToClipboard>
  )
