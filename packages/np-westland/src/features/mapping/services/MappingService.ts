interface MappingService {
  geocode(location: string): Promise<unknown[]>;
}

export default MappingService;
