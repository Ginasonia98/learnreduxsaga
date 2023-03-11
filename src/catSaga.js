import { call, put, takeEvery } from "redux-saga/effects";
import { getCatsSuccess } from "./catState";

function* workgetCatsFetch() {
  const cats = yield call(() => fetch("https://api.thecatapi.com/v1/breeds"));
  const formattedCats = yield cats.json();
  for (let data of formattedCats) {
    console.log(data.reference_image_id);
    if (data.reference_image_id) {
      const imageData = yield call(() =>
        fetch(`https://api.thecatapi.com/v1/images/${data.reference_image_id}`)
      );
      const image = yield imageData.json();
      data.image_url = image.url;
    }
  }
  const formattedCatsShortened = formattedCats.slice(0, 70);
  yield put(getCatsSuccess(formattedCatsShortened));
}

function* catSaga() {
  yield takeEvery("cats/getCatsFetch", workgetCatsFetch);
}

export default catSaga;
