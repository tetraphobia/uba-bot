import { Discord } from '@typeit/discord';
import * as Path from "path"
import {UBA} from "../index";

const {modules_enabled} = UBA.config
const imports = modules_enabled.map(e =>
    Path.join(__dirname, '../', 'modules', e)
)

@Discord(UBA.config.prefix, { import: imports })
export abstract class UBADiscord {}