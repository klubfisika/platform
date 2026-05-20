import { component$, useSignal, $ } from '@builder.io/qwik';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  tabs: Tab[];
  activeTab?: string;
  onTabChange$?: (tabId: string) => void;
}

export default component$<Props>(({ tabs, activeTab = tabs[0]?.id }) => {
  const currentTab = useSignal(activeTab);

  const handleTabClick = $((tabId: string) => {
    currentTab.value = tabId;
  });

  return (
    <div class="bg-white border border-gray-100 rounded-xl mb-4 overflow-x-auto">
      <div class="flex text-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick$={() => handleTabClick(tab.id)}
            class={`px-4 py-3 font-medium transition whitespace-nowrap ${
              index > 0 ? 'border-l border-gray-100' : ''
            } ${
              currentTab.value === tab.id
                ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
});
