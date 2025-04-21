import { Header } from './Header'
import { Button } from './Button'
import { weekDays, weeklyWorkoutPlan, exerciseCategories } from './data'
import { useState } from 'react'

export default function App() {
	const [currentDay, SetCurrentDay] = useState('Mon')
	return (
		<div className='App'>
			<Header>🏋️ MyWorkoutApp</Header>
			<DaySelector OnSetCurrentDay={SetCurrentDay}></DaySelector>
			<AddExercise />
			<ExerciseList currentDay={currentDay} />
			<WorkoutList currentDay={currentDay} />
			<WorkoutSummary />
		</div>
	)
}

function DaySelector({ OnSetCurrentDay }) {
	return (
		<div className='DaySelector'>
			{weekDays.map(day => (
				<Button value={day.short} fn={() => OnSetCurrentDay(day.name)} key={day.id}>
					{day.short}
				</Button>
			))}
		</div>
	)
}

function AddExercise() {
	const formIsOpen = true
	return (
		<>
			<div className='AddExercise'>
				<Button styleEl={'success'}>Add Exercise ➕</Button>
			</div>
			{formIsOpen && (
				<form>
					<h2>Add New Exercise</h2>
					<div>
						<label>Name:</label>
						<input type='text' placeholder='Type exercise name ...'></input>
					</div>
					<div>
						<label>Sets:</label>
						<input type='number' min={1} placeholder='Num sets ...'></input>
					</div>
					<div>
						<label>Rest:</label>
						<input type='number' min={1} placeholder='Break in seconds /s'></input>
					</div>
					<div>
						<label>Target Weight:</label>
						<input type='number' placeholder='Target Weight (optional)'></input>
					</div>
					<div>
						<label>Exercise category:</label>
						<select>
							{exerciseCategories.map(exercise => (
								<option value={exercise.value} key={exercise.id}>
									{exercise.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<Button styleEl={'danger'}>Cancel ❌</Button>
						<Button styleEl={'success'}>Save 💾</Button>
					</div>
				</form>
			)}
		</>
	)
}

function ExerciseList({ currentDay }) {
	return (
		<div>
			<ul>
				{weeklyWorkoutPlan
					.filter(workout => workout.day === currentDay)
					.map(workout =>
						workout.exercises.map(exercise => (
							<ExerciseItem
								key={exercise.id}
								name={exercise.name}
								sets={exercise.sets}
								reps={exercise.reps}
								target={exercise.targetWeight}
								category={exercise.category}
								rest={exercise.rest}
							/>
						))
					)}
			</ul>
			<Button>Start Workout 🏃‍♂️‍➡️</Button>
		</div>
	)
}

function ExerciseItem({ name, sets, reps, target, category, rest }) {
	return (
		<li>
			<div>
				<h2>Name:</h2>
				<p>{name}</p>
			</div>
			<div>
				<h2>Sets:</h2>
				<p>{sets}</p>
			</div>
			<div>
				<h2>Reps/Seconds:</h2>
				<p>{reps}</p>
			</div>
			<div>
				<h2>Target:</h2>
				<p>
					{target === 0 ? 'Body Weight 🏋️‍♂️' : target} {target === 0 ? '' : 'kg'}
				</p>
			</div>
			<div>
				<h2>Category:</h2>
				<p>{category} </p>
			</div>
			<div>
				<h2>Rest:</h2>
				<p>{rest} seconds </p>
			</div>
			<div>
				<Button>Edit 🛠️</Button>
				<Button styleEl={'danger'}>Delete 🗑️</Button>
			</div>
		</li>
	)
}

function WorkoutList({ currentDay }) {
	const activeWorkout = weeklyWorkoutPlan
		.filter(workout => workout.day === currentDay)
		.flatMap(workout => workout.exercises.map(exercises => exercises))

	return (
		<div>
			<ul>
				{activeWorkout.map(workout => (
					<WorkoutItem
						name={workout.name}
						sets={workout.sets}
						reps={workout.reps}
						target={workout.targetWeight}
						rest={workout.rest}
						key={workout.id}
					/>
				))}
			</ul>
			<BreakTimer />
		</div>
	)
}

function WorkoutItem({ name, sets, reps, target, rest }) {
	return (
		<li className='WorkoutItem'>
			<div className='WorkoutHeader'>
				{name}
				<Button>
					<ion-icon name='arrow-down-outline'></ion-icon>
				</Button>
			</div>
			<ul className='WorkoutDetails'>
				{Array.from({ length: sets }, (_, i) => (
					<li key={i}>
						Set {i + 1}: {reps} reps {target ? `${target} kg` : ''} ⏱️ {rest}
					</li>
				))}
			</ul>
		</li>
	)
}

function BreakTimer() {
	return <div className='BreakTimer'>04:44s</div>
}

function WorkoutSummary() {
	return (
		<div className='WorkoutSummary'>
			<p className='total'>Total Exercises: 3</p>
			<p className='completed'>Completed: 2</p>
			<p className='missed'>Missed: 1</p>
		</div>
	)
}
