import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-autopsy-findings.ts';
import '@/ai/flows/generate-autopsy-scenario.ts';
import '@/ai/flows/customize-autopsy-scenario.ts';