import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LocalStorageService, LOCALSTORAGE_KEY } from './local-storage.service';


describe('UserService', () => {
  let injector: TestBed;
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        LocalStorageService
      ],
    });

    injector = getTestBed();
    service = injector.get(LocalStorageService);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  describe('get', () => {

    it('ローカルストレージに値がない場合', () => {
        expect(service.get(LOCALSTORAGE_KEY.TOKEN)).toBeNull();
        expect(service.get(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID)).toBeNull();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(service.get(LOCALSTORAGE_KEY.TOKEN)).toEqual('SampleToken');
      expect(service.get(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID)).toEqual('SampleId');
    });
  });

  describe('set', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      service.set(LOCALSTORAGE_KEY.TOKEN, 'SampleToken');
      service.set(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID, 'SampleId');

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      service.set(LOCALSTORAGE_KEY.TOKEN, 'SampleToken2');
      service.set(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID, 'SampleId2');

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('SampleToken2');
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId2');
    });
  });


  describe('remove', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      service.remove(LOCALSTORAGE_KEY.TOKEN);
      service.remove(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID);

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toBeNull();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      service.remove(LOCALSTORAGE_KEY.TOKEN);
      service.remove(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID);

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toBeNull();
    });
  });


  describe('has', () => {

    it('ローカルストレージに値がない場合', () => {
      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toBeNull();
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toBeNull();

      expect(service.has(LOCALSTORAGE_KEY.TOKEN)).toBeFalsy();
      expect(service.has(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID)).toBeFalsy();
    });

    it('ローカルストレージに値がある場合', () => {
      localStorage.setItem(LOCALSTORAGE_KEY.TOKEN.toString(), 'SampleToken');
      localStorage.setItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString(), 'SampleId');

      expect(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN.toString())).toEqual('SampleToken');
      expect(localStorage.getItem(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID.toString())).toEqual('SampleId');

      expect(service.has(LOCALSTORAGE_KEY.TOKEN)).toBeTruthy();
      expect(service.has(LOCALSTORAGE_KEY.SELECTED_CONDITION_ID)).toBeTruthy();
    });
  });

});
