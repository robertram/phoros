import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

type IRichTextProps = {
  rich: Document | undefined;
};

export const RichText: any = ({ rich }: IRichTextProps) => {

  if (rich) return documentToReactComponents(rich);
};
