import * as Render from './index'
import React, { JSXElementConstructor } from 'react'

interface BlockProps {
  blocks: any[]
}
type ComponentProps<T extends JSXElementConstructor<{ data: any }>> =
  React.ComponentProps<T>

const Blocks = React.memo<BlockProps>(({ blocks }) => {
  const renderBlock = function (block: any, index: number) {
    if (block) {
      const contentType = block?.sys?.contentType?.sys?.id
      const id = block.sys.id

      switch (contentType) {
        case 'blockHero':
          return (
            <Render.BlockHero
              key={`${id}-${index}`}
              data={
                block as ComponentProps<
                  typeof Render.BlockHero
                >['data']
              }
            />
          )
        case 'blockTextButtonSection':
          return (
            <Render.BlockTextButtonSection
              key={`${id}-${index}`}
              data={
                block as ComponentProps<
                  typeof Render.BlockTextButtonSection
                >['data']
              }
            />
          )
          case 'blockFaq':
            return (
              <Render.BlockFAQ
                key={`${id}-${index}`}
                data={
                  block as ComponentProps<
                    typeof Render.BlockFAQ
                  >['data']
                }
              />
            )
        case 'blockFooter':
          return (
            <Render.BlockFooter
              key={`${id}-${index}`}
              data={
                block as ComponentProps<
                  typeof Render.BlockFooter
                >['data']
              }
            />
          )
        default:
          console.warn(
            `No entities matches the provided ID for "Blocks" component. ID: ${id}`
          )
          break
      }
    }
  }

  return (
    <>
      {blocks &&
        blocks.length &&
        blocks
          .filter((block: any) => block)
          .map((block: any, index: number) => renderBlock(block, index))}
    </>
  )
})

Blocks.displayName = 'Blocks'

export default Blocks
