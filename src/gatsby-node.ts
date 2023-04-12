import { type GatsbyNode } from 'gatsby';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => Joi.object({
  strategy: Joi.string().allow('pick_first', 'pick_last'),
});
