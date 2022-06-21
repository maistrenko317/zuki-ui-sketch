import { LoggedOutGuard } from '@snowl/base-app/guards/logged-out.guard';
import { LoggedInGuard } from '@snowl/base-app/guards/logged-in.guard';
import {LoggedInIfNecessaryGuard} from "@snowl/base-app/guards/logged-in-if-necessary.guard";

export * from './logged-out.guard';
export * from './logged-in.guard';
export * from './logged-in-if-necessary.guard'

export const BASE_GUARDS = [LoggedOutGuard, LoggedInGuard, LoggedInIfNecessaryGuard];
