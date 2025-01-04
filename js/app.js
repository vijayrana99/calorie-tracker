class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").value = this._calorieLimit;
  }

  // Public methods

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeals(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkouts(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      this._totalCalories -= this._meals[index].calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeMeal(id);
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      this._totalCalories += this._workouts[index].calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // Private methods

  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById("calories-total");
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const caloriesLimitElement = document.getElementById("calories-limit");
    caloriesLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.getElementById("calories-consumed");

    const consumed = this._meals.reduce((acc, meal) => acc + meal.calories, 0);

    caloriesConsumedElement.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.getElementById("calories-burned");

    const burned = this._workouts.reduce((acc, meal) => acc + meal.calories, 0);
    caloriesBurnedElement.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingElement =
      document.getElementById("calories-remaining");

    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.classList.remove("bg-light");
      caloriesRemainingElement.parentElement.classList.add("bg-danger");
    }
  }

  _displayCaloriesProgress() {
    const caloriesProgressElement = document.getElementById("calorie-progress");
    const progress = (this._totalCalories / this._calorieLimit) * 100;
    caloriesProgressElement.style.width = `${progress}%`;

    if (progress > 100) {
      caloriesProgressElement.classList.remove("bg-success");
      caloriesProgressElement.classList.add("bg-danger");
    } else {
      caloriesProgressElement.classList.remove("bg-danger");
      caloriesProgressElement.classList.add("bg-success");
    }
  }

  _displayNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items");
    const mealEl = document.createElement("div");

    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);

    mealEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>`;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");

    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);

    workoutEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                ${workout.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>`;

    workoutsEl.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = parseInt(localStorage.getItem("calorieLimit"));
    }

    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = 0;
    } else {
      totalCalories = parseInt(localStorage.getItem("totalCalories"));
    }

    return totalCalories;
  }

  static updateTotalCalories(totalCalories) {
    localStorage.setItem("totalCalories", totalCalories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }

    return meals;
  }

  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });

    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }

    return workouts;
  }

  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    this._loadEventListeners();

    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, parseInt(calories.value));
      this._tracker.addMeal(meal);
    } else {
      const meal = new Workout(name.value, parseInt(calories.value));
      this._tracker.addWorkout(meal);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem);
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset(e) {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please enter a value");
      return;
    }

    this._tracker.setLimit(parseInt(limit.value));

    limit.value = "";

    const modelEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modelEl);
    modal.hide();
  }
}

const app = new App();
