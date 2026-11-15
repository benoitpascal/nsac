import { mountTopicTabs } from '@/modules/information/ui/topic-tabs.view';
import { requireElement } from '@/shared/dom';

mountTopicTabs(requireElement<HTMLElement>('.information__menu'));
