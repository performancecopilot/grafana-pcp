import { SearchEntity, EntityType } from '../models/endpoints/search';

export class SearchEntityUtil {
    static toEntityTypes(searchEntity: SearchEntity): EntityType[] {
        const result: EntityType[] = [];
        if (searchEntity & SearchEntity.Metrics) {
            result.push(EntityType.Metric);
        }
        if (searchEntity & SearchEntity.Instances) {
            result.push(EntityType.Instance);
        }
        if (searchEntity & SearchEntity.InstanceDomains) {
            result.push(EntityType.InstanceDomain);
        }
        return result;
    }
}
