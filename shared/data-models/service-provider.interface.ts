/**
 * Provider represents a streaming, rental or purchase provider for a movie
 */
export interface ServiceProvider {
    // path (without the baseUrl) to the logo
    logo_path: string,
    // id of the provider in case we need to go get more details
    provider_id: number,
    // human readable name ex: Hulu or Netflix
    provider_name: string,
    // Priority order if you'd like to display the icons by their priority 
    display_priority: number
}