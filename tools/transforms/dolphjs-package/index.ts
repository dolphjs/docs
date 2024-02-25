import { Package } from 'dgeni';
import dolphjsContentPackage from '../dolphjs-content-package';
import dolphjsBasePackage from '../dolphjs-base-package';
import { cleanGeneratedFiles } from './processors';

export default new Package('dolphjs', [
  dolphjsContentPackage,
  dolphjsBasePackage,
]).processor(cleanGeneratedFiles);
