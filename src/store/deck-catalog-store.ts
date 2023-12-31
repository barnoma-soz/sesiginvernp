import { makeAutoObservable } from "mobx";
import { apiDeckCatalog, apiDeckCategories } from "../api/api.ts";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import { DeckCatalogResponse } from "../../functions/catalog-decks.ts";
import { TextField } from "../lib/mobx-form/mobx-form.ts";
import { cachePromise } from "../lib/cache/cache-promise.ts";
import { DeckCategoryResponse } from "../../functions/deck-categories.ts";
import { persistableField } from "../lib/mobx-form/persistable-field.ts";
import { t } from "../translations/t.ts";

export enum LanguageFilter {
  Any = "any",
  English = "en",
  Spanish = "es",
  Russian = "ru",
}

export const languageFilterToNativeName = (str: LanguageFilter): string => {
  switch (str) {
    case LanguageFilter.Any:
      return t("any_language");
    case LanguageFilter.English:
      return "English";
    case LanguageFilter.Russian:
      return "Русский";
    case LanguageFilter.Spanish:
      return "Español";
    default:
      return str satisfies never;
  }
};

const decksCached = cachePromise<DeckCatalogResponse>();
const categoriesCached = cachePromise<DeckCategoryResponse>();

export class DeckCatalogStore {
  decks?: IPromiseBasedObservable<DeckCatalogResponse>;
  filters = {
    language: persistableField(new TextField(LanguageFilter.Any), "catalogLn"),
    categoryId: new TextField(""),
  };
  categories?: IPromiseBasedObservable<DeckCategoryResponse>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.decks = fromPromise(decksCached(apiDeckCatalog()));
    this.categories = fromPromise(categoriesCached(apiDeckCategories()));
  }

  get filteredDecks() {
    if (this.decks?.state !== "fulfilled") {
      return [];
    }

    const language = this.filters.language.value;
    const categoryId = this.filters.categoryId.value;

    return this.decks.value.decks.filter((deck) => {
      if (language !== LanguageFilter.Any && deck.available_in !== language) {
        return false;
      }

      if (!!categoryId && deck.category_id !== categoryId) {
        return false;
      }

      return true;
    });
  }
}
