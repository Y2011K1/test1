import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Token-authorized client for admin mutations
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
